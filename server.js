require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: ['DATE']
});

app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM land_parcels');
    res.json({ ok: true, total_parcels: rows[0].total });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Mouza list for the dropdown (Dhaka division only)
app.get('/api/mouzas', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT mouza_id, mouza_name, upazila, district, jl_number
       FROM mouzas WHERE division = 'Dhaka'
       ORDER BY district, upazila, mouza_name`
    );
    res.json({ ok: true, mouzas: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// A land is identified by all four: mouza + survey type + dag number + khatian number
app.get('/api/search', async (req, res) => {
  const mouza_id = (req.query.mouza_id || '').trim();
  const survey_type = (req.query.survey_type || '').trim();
  const dag = (req.query.dag || '').trim();
  const khatian = (req.query.khatian || '').trim();

  if (!mouza_id || !survey_type || !dag || !khatian) {
    return res.status(400).json({
      ok: false,
      error: 'mouza_id, survey_type, dag and khatian are all required'
    });
  }

  try {
    const [lands] = await db.query(
      `SELECT l.parcel_id, m.division, m.district, m.upazila, m.mouza_name, m.jl_number,
              l.dag_number, l.survey_type, l.recorded_area, l.area_unit, l.land_class,
              k.khatian_number, p.full_name AS owner
       FROM land_parcels l
       JOIN mouzas m ON l.mouza_id = m.mouza_id
       JOIN khatian_parcels kp ON l.parcel_id = kp.parcel_id
       JOIN khatian_records k ON kp.khatian_id = k.khatian_id
            AND k.mouza_id = l.mouza_id AND k.survey_type = l.survey_type
       LEFT JOIN ownership_records o ON k.khatian_id = o.khatian_id
       LEFT JOIN persons p ON o.person_id = p.person_id
       WHERE l.mouza_id = ? AND l.survey_type = ?
         AND l.dag_number = ? AND k.khatian_number = ?`,
      [mouza_id, survey_type, dag, khatian]
    );

    for (const land of lands) {
      const [risks] = await db.query(
        `SELECT risk_type, reference_number, description, record_status, record_date
         FROM risk_records WHERE parcel_id = ? AND review_status = 'APPROVED'`,
        [land.parcel_id]
      );
      land.risks = risks.map(r => {
        const d = String(r.description || '');
        if (d.startsWith('Bayna amount:') || d.startsWith('Mortgage amount:')) {
          const m = d.match(/Valid until: (\d{4}-\d{2}-\d{2})/);
          r.description = m ? 'মেয়াদ: ' + m[1] : '';
        }
        return r;
      });
    }
    res.json({ ok: true, count: lands.length, lands });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Login helpers ----------
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: 'Login required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ ok: false, error: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: 'Not allowed' });
    }
    next();
  };
}

// ---------- Register (always creates a normal USER) ----------
app.post('/api/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (name.length < 2) return res.status(400).json({ ok: false, error: 'Name is too short' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Email is not valid' });
  if (password.length < 8) return res.status(400).json({ ok: false, error: 'Password must be at least 8 characters' });

  try {
    const [exists] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (exists.length > 0) return res.status(409).json({ ok: false, error: 'This email is already registered' });

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'USER')",
      [name, email, hash]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Login ----------
app.post('/api/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const wrong = { ok: false, error: 'Email or password is incorrect' };

  try {
    const [rows] = await db.query(
      'SELECT user_id, name, role, password_hash, account_status FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) return res.status(401).json(wrong);

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json(wrong);
    if (user.account_status !== 'ACTIVE') {
      return res.status(403).json({ ok: false, error: 'This account is not active' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ ok: true, token, user: { name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Who am I ----------
app.get('/api/me', authRequired, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// ---------- Officer registration (checked against police_registry + secret code) ----------
// Simple in-memory limit: at most 8 attempts per IP in 15 minutes
const officerAttempts = new Map();
function tooManyAttempts(ip) {
  const now = Date.now();
  const list = (officerAttempts.get(ip) || []).filter(t => now - t < 15 * 60 * 1000);
  list.push(now);
  officerAttempts.set(ip, list);
  return list.length > 8;
}

app.post('/api/register-officer', async (req, res) => {
  if (tooManyAttempts(req.ip)) {
    return res.status(429).json({ ok: false, error: 'Too many attempts' });
  }
  const regCode = String(req.body.registration_code || '').trim().toUpperCase();
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const badge = String(req.body.badge_number || '').trim();
  const officerId = String(req.body.officer_id_number || '').trim();

  if (name.length < 2) return res.status(400).json({ ok: false, error: 'Name is too short' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Email is not valid' });
  if (password.length < 8) return res.status(400).json({ ok: false, error: 'Password must be at least 8 characters' });
  if (!badge || !officerId) return res.status(400).json({ ok: false, error: 'Badge number and officer ID are required' });
  if (!regCode) return res.status(400).json({ ok: false, error: 'Registration code is required' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [emailRows] = await conn.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (emailRows.length > 0) {
      await conn.rollback();
      return res.status(409).json({ ok: false, error: 'This email is already registered' });
    }

    const [reg] = await conn.query(
      `SELECT registry_id, code_hash FROM police_registry
       WHERE badge_number = ? AND officer_id_number = ?
         AND LOWER(full_name) = LOWER(?) AND is_used = FALSE
       FOR UPDATE`,
      [badge, officerId, name]
    );
    // Same error for every kind of mismatch, so nobody can learn which part was wrong
    if (reg.length === 0 || !reg[0].code_hash || !(await bcrypt.compare(regCode, reg[0].code_hash))) {
      await conn.rollback();
      return res.status(400).json({ ok: false, error: 'Your details did not match' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [ins] = await conn.query(
      "INSERT INTO users (name, email, password_hash, role, account_status) VALUES (?, ?, ?, 'OFFICER', 'PENDING')",
      [name, email, hash]
    );
    await conn.query(
      'UPDATE police_registry SET is_used = TRUE, linked_user_id = ? WHERE registry_id = ?',
      [ins.insertId, reg[0].registry_id]
    );
    await conn.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, 'OFFICER_REGISTERED', 'USER', ?, 'Waiting for admin approval')",
      [ins.insertId, ins.insertId]
    );
    await conn.commit();
    res.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ ok: false, error: 'Server error' });
  } finally {
    conn.release();
  }
});

// ---------- Admin: pending officers ----------
app.get('/api/admin/pending-officers', authRequired, requireRole('ADMIN'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.name, u.email, u.created_at,
              p.full_name AS registry_name, p.station_phone, p.badge_number, p.officer_id_number,
              p.rank_title, p.police_station, p.district
       FROM users u
       JOIN police_registry p ON p.linked_user_id = u.user_id
       WHERE u.role = 'OFFICER' AND u.account_status = 'PENDING'
       ORDER BY u.created_at`
    );
    res.json({ ok: true, officers: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Admin: approve an officer ----------
app.post('/api/admin/officers/:id/approve', authRequired, requireRole('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [r] = await db.query(
      "UPDATE users SET account_status = 'ACTIVE' WHERE user_id = ? AND role = 'OFFICER' AND account_status = 'PENDING'",
      [id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'No pending officer found' });
    await db.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, 'OFFICER_APPROVED', 'USER', ?, 'Approved by admin')",
      [req.user.user_id, id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Admin: reject an officer (frees the police registry entry) ----------
app.post('/api/admin/officers/:id/reject', authRequired, requireRole('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [r] = await db.query(
      "UPDATE users SET account_status = 'REJECTED' WHERE user_id = ? AND role = 'OFFICER' AND account_status = 'PENDING'",
      [id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'No pending officer found' });
    await db.query(
      'UPDATE police_registry SET is_used = FALSE, linked_user_id = NULL WHERE linked_user_id = ?',
      [id]
    );
    await db.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, 'OFFICER_REJECTED', 'USER', ?, 'Rejected by admin')",
      [req.user.user_id, id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Officer: submit a case against a land ----------
const CASE_TYPES = ['LAND_DISPUTE', 'CRIMINAL', 'CIVIL', 'FRAUD', 'OTHER'];

app.post('/api/officer/submit-case', authRequired, requireRole('OFFICER'), async (req, res) => {
  const mouza_id = String(req.body.mouza_id || '').trim();
  const survey_type = String(req.body.survey_type || '').trim();
  const dag = String(req.body.dag || '').trim();
  const khatian = String(req.body.khatian || '').trim();
  const case_type = String(req.body.case_type || '').trim();
  const case_number = String(req.body.case_number || '').trim();
  const court = String(req.body.court || '').trim();
  const details = String(req.body.details || '').trim();
  const case_date = String(req.body.case_date || '').trim();

  if (!mouza_id || !survey_type || !dag || !khatian) {
    return res.status(400).json({ ok: false, error: 'Land details are required' });
  }
  if (!CASE_TYPES.includes(case_type)) {
    return res.status(400).json({ ok: false, error: 'Case type is not valid' });
  }
  if (case_number.length < 2 || case_number.length > 100) {
    return res.status(400).json({ ok: false, error: 'Case number is required' });
  }
  if (court.length < 2 || court.length > 150) {
    return res.status(400).json({ ok: false, error: 'Court name is required' });
  }
  if (details.length < 10 || details.length > 1500) {
    return res.status(400).json({ ok: false, error: 'Details must be 10 to 1500 characters' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(case_date) || isNaN(new Date(case_date)) || new Date(case_date) > new Date()) {
    return res.status(400).json({ ok: false, error: 'Case date is not valid' });
  }

  try {
    const [lands] = await db.query(
      `SELECT l.parcel_id
       FROM land_parcels l
       JOIN khatian_parcels kp ON l.parcel_id = kp.parcel_id
       JOIN khatian_records k ON kp.khatian_id = k.khatian_id
            AND k.mouza_id = l.mouza_id AND k.survey_type = l.survey_type
       WHERE l.mouza_id = ? AND l.survey_type = ?
         AND l.dag_number = ? AND k.khatian_number = ?
       LIMIT 1`,
      [mouza_id, survey_type, dag, khatian]
    );
    if (lands.length === 0) {
      return res.status(404).json({ ok: false, error: 'Land not found' });
    }
    const parcel_id = lands[0].parcel_id;

    const [dup] = await db.query(
      `SELECT risk_id FROM risk_records
       WHERE parcel_id = ? AND risk_type = 'CASE' AND reference_number = ?
         AND review_status IN ('PENDING', 'APPROVED')`,
      [parcel_id, case_number]
    );
    if (dup.length > 0) {
      return res.status(409).json({ ok: false, error: 'This case is already submitted' });
    }

    const description = 'Case type: ' + case_type + ' | Court: ' + court + ' | ' + details;
    const [ins] = await db.query(
      `INSERT INTO risk_records
         (parcel_id, risk_type, reference_number, description, record_status,
          review_status, record_date, submitted_by, source_id)
       VALUES (?, 'CASE', ?, ?, 'ACTIVE', 'PENDING', ?, ?, 1)`,
      [parcel_id, case_number, description, case_date, req.user.user_id]
    );
    await db.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, 'CASE_SUBMITTED', 'RISK', ?, 'Waiting for admin review')",
      [req.user.user_id, ins.insertId]
    );
    res.json({ ok: true, risk_id: ins.insertId });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Officer: my submitted cases ----------
app.get('/api/officer/my-submissions', authRequired, requireRole('OFFICER'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.risk_id, r.reference_number, r.record_date, r.review_status,
              l.dag_number, l.survey_type, m.mouza_name
       FROM risk_records r
       JOIN land_parcels l ON r.parcel_id = l.parcel_id
       JOIN mouzas m ON l.mouza_id = m.mouza_id
       WHERE r.submitted_by = ? AND r.risk_type = 'CASE'
       ORDER BY r.risk_id DESC
       LIMIT 50`,
      [req.user.user_id]
    );
    res.json({ ok: true, submissions: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});


// ---------- Admin: pending cases to review (with land details from the database) ----------
app.get('/api/admin/pending-cases', authRequired, requireRole('ADMIN'), async (req, res) => {
  try {
    const [cases] = await db.query(
      `SELECT r.risk_id, r.parcel_id, r.reference_number, r.description, r.record_date, r.submitted_by,
              l.dag_number, l.survey_type, l.recorded_area, l.area_unit, l.land_class,
              m.mouza_name, m.upazila, m.district, m.jl_number,
              u.name AS officer_name, p.badge_number, p.police_station, p.district AS officer_district
       FROM risk_records r
       JOIN land_parcels l ON r.parcel_id = l.parcel_id
       JOIN mouzas m ON l.mouza_id = m.mouza_id
       LEFT JOIN users u ON r.submitted_by = u.user_id
       LEFT JOIN police_registry p ON p.linked_user_id = u.user_id
       WHERE r.review_status = 'PENDING' AND r.risk_type = 'CASE'
       ORDER BY r.risk_id`
    );

    for (const c of cases) {
      const [owners] = await db.query(
        `SELECT k.khatian_number, pr.full_name AS owner
         FROM khatian_parcels kp
         JOIN khatian_records k ON kp.khatian_id = k.khatian_id
         LEFT JOIN ownership_records o ON o.khatian_id = k.khatian_id
         LEFT JOIN persons pr ON pr.person_id = o.person_id
         WHERE kp.parcel_id = ?`,
        [c.parcel_id]
      );
      c.owners = owners;
      c.khatian_number = owners.length ? owners[0].khatian_number : null;

      const [others] = await db.query(
        `SELECT risk_type, reference_number, record_status, review_status, record_date
         FROM risk_records
         WHERE parcel_id = ? AND risk_id <> ? AND review_status IN ('APPROVED', 'PENDING')
         ORDER BY risk_id`,
        [c.parcel_id, c.risk_id]
      );
      c.other_records = others;

      const [dup] = await db.query(
        `SELECT COUNT(*) AS n FROM risk_records
         WHERE risk_type = 'CASE' AND reference_number = ? AND parcel_id <> ?
           AND review_status IN ('APPROVED', 'PENDING')`,
        [c.reference_number, c.parcel_id]
      );

      const [stats] = await db.query(
        `SELECT COUNT(*) AS total,
                COALESCE(SUM(review_status = 'APPROVED'), 0) AS approved,
                COALESCE(SUM(review_status = 'REJECTED'), 0) AS rejected
         FROM risk_records WHERE submitted_by = ? AND risk_type = 'CASE'`,
        [c.submitted_by]
      );
      c.officer_stats = {
        total: Number(stats[0].total),
        approved: Number(stats[0].approved),
        rejected: Number(stats[0].rejected)
      };

      c.warnings = [];
      if (dup[0].n > 0) c.warnings.push('SAME_CASE_NUMBER_ON_OTHER_LAND');
      if (c.officer_district && c.officer_district !== c.district) c.warnings.push('OFFICER_DISTRICT_DIFFERS');
      const [khas] = await db.query(
        "SELECT COUNT(*) AS n FROM risk_records WHERE parcel_id = ? AND risk_type = 'KHAS' AND review_status = 'APPROVED'",
        [c.parcel_id]
      );
      if (khas[0].n > 0) c.warnings.push('LAND_IS_KHAS');
    }

    res.json({ ok: true, cases });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Admin: approve or reject a submitted case ----------
async function decideCase(req, res, newStatus, actionName) {
  const id = Number(req.params.id);
  try {
    const [r] = await db.query(
      `UPDATE risk_records
       SET review_status = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE risk_id = ? AND risk_type = 'CASE' AND review_status = 'PENDING'`,
      [newStatus, req.user.user_id, id]
    );
    if (r.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: 'No pending case found' });
    }
    await db.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, ?, 'RISK', ?, 'Reviewed by admin')",
      [req.user.user_id, actionName, id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
}

app.post('/api/admin/cases/:id/approve', authRequired, requireRole('ADMIN'), (req, res) =>
  decideCase(req, res, 'APPROVED', 'CASE_APPROVED'));

app.post('/api/admin/cases/:id/reject', authRequired, requireRole('ADMIN'), (req, res) =>
  decideCase(req, res, 'REJECTED', 'CASE_REJECTED'));

// ---------- Helper: is this a real YYYY-MM-DD date? ----------
function isValidDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s));
}

// ---------- User: submit bayna (advance payment) ----------
app.post('/api/user/submit-bayna', authRequired, requireRole('USER'), async (req, res) => {
  const mouza_id = String(req.body.mouza_id || '').trim();
  const survey_type = String(req.body.survey_type || '').trim();
  const dag = String(req.body.dag || '').trim();
  const khatian = String(req.body.khatian || '').trim();
  const agreement = String(req.body.agreement_number || '').trim();
  const seller = String(req.body.seller_name || '').trim().replace(/\|/g, '/');
  const amount = Number(req.body.amount);
  const bayna_date = String(req.body.bayna_date || '').trim();
  const valid_until = String(req.body.valid_until || '').trim();
  const details = String(req.body.details || '').trim().replace(/\|/g, '/');

  if (!mouza_id || !survey_type || !dag || !khatian) {
    return res.status(400).json({ ok: false, error: 'Land details are required' });
  }
  if (agreement.length < 2 || agreement.length > 100) {
    return res.status(400).json({ ok: false, error: 'Agreement number is required' });
  }
  if (seller.length < 2 || seller.length > 150) {
    return res.status(400).json({ ok: false, error: 'Seller name is required' });
  }
  if (!Number.isInteger(amount) || amount <= 0 || amount > 10000000000) {
    return res.status(400).json({ ok: false, error: 'Amount is not valid' });
  }
  if (!isValidDate(bayna_date) || new Date(bayna_date) > new Date()) {
    return res.status(400).json({ ok: false, error: 'Bayna date is not valid' });
  }
  if (!isValidDate(valid_until) || new Date(valid_until) < new Date(bayna_date)) {
    return res.status(400).json({ ok: false, error: 'Valid-until date is not valid' });
  }
  if (details.length > 500) {
    return res.status(400).json({ ok: false, error: 'Details are too long' });
  }

  try {
    const [lands] = await db.query(
      `SELECT l.parcel_id
       FROM land_parcels l
       JOIN khatian_parcels kp ON l.parcel_id = kp.parcel_id
       JOIN khatian_records k ON kp.khatian_id = k.khatian_id
            AND k.mouza_id = l.mouza_id AND k.survey_type = l.survey_type
       WHERE l.mouza_id = ? AND l.survey_type = ?
         AND l.dag_number = ? AND k.khatian_number = ?
       LIMIT 1`,
      [mouza_id, survey_type, dag, khatian]
    );
    if (lands.length === 0) {
      return res.status(404).json({ ok: false, error: 'Land not found' });
    }
    const parcel_id = lands[0].parcel_id;

    // Government (khas) land or land under acquisition cannot take bayna
    const [blocked] = await db.query(
      `SELECT risk_id FROM risk_records
       WHERE parcel_id = ? AND risk_type IN ('KHAS', 'ACQUISITION')
         AND review_status = 'APPROVED' LIMIT 1`,
      [parcel_id]
    );
    if (blocked.length > 0) {
      return res.status(409).json({ ok: false, error: 'Bayna is not allowed on this land' });
    }

    const [dup] = await db.query(
      `SELECT risk_id FROM risk_records
       WHERE parcel_id = ? AND risk_type = 'ADVANCE' AND reference_number = ?
         AND review_status IN ('PENDING', 'APPROVED')`,
      [parcel_id, agreement]
    );
    if (dup.length > 0) {
      return res.status(409).json({ ok: false, error: 'This bayna is already submitted' });
    }

    const description = 'Bayna amount: ' + amount + ' BDT | Seller: ' + seller +
      ' | Valid until: ' + valid_until + (details ? ' | ' + details : '');
    const [ins] = await db.query(
      `INSERT INTO risk_records
         (parcel_id, risk_type, reference_number, description, record_status,
          review_status, record_date, submitted_by, source_id)
       VALUES (?, 'ADVANCE', ?, ?, 'ACTIVE', 'PENDING', ?, ?, 1)`,
      [parcel_id, agreement, description, bayna_date, req.user.user_id]
    );
    await db.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, 'BAYNA_SUBMITTED', 'RISK', ?, 'Waiting for admin review')",
      [req.user.user_id, ins.insertId]
    );
    res.json({ ok: true, risk_id: ins.insertId });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- User: my submitted bayna ----------
app.get('/api/user/my-bayna', authRequired, requireRole('USER'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.risk_id, r.reference_number, r.record_date, r.review_status,
              l.dag_number, l.survey_type, m.mouza_name
       FROM risk_records r
       JOIN land_parcels l ON r.parcel_id = l.parcel_id
       JOIN mouzas m ON l.mouza_id = m.mouza_id
       WHERE r.submitted_by = ? AND r.risk_type = 'ADVANCE'
       ORDER BY r.risk_id DESC
       LIMIT 50`,
      [req.user.user_id]
    );
    res.json({ ok: true, submissions: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Helper: find a land by the four identifiers ----------
async function findParcel(mouza_id, survey_type, dag, khatian) {
  const [lands] = await db.query(
    `SELECT l.parcel_id
     FROM land_parcels l
     JOIN khatian_parcels kp ON l.parcel_id = kp.parcel_id
     JOIN khatian_records k ON kp.khatian_id = k.khatian_id
          AND k.mouza_id = l.mouza_id AND k.survey_type = l.survey_type
     WHERE l.mouza_id = ? AND l.survey_type = ?
       AND l.dag_number = ? AND k.khatian_number = ?
     LIMIT 1`,
    [mouza_id, survey_type, dag, khatian]
  );
  return lands.length ? lands[0].parcel_id : null;
}

// ---------- User: submit mortgage (bondok) ----------
app.post('/api/user/submit-mortgage', authRequired, requireRole('USER'), async (req, res) => {
  const mouza_id = String(req.body.mouza_id || '').trim();
  const survey_type = String(req.body.survey_type || '').trim();
  const dag = String(req.body.dag || '').trim();
  const khatian = String(req.body.khatian || '').trim();
  const deed = String(req.body.deed_number || '').trim();
  const borrower = String(req.body.borrower_name || '').trim().replace(/\|/g, '/');
  const amount = Number(req.body.amount);
  const mortgage_date = String(req.body.mortgage_date || '').trim();
  const valid_until = String(req.body.valid_until || '').trim();
  const details = String(req.body.details || '').trim().replace(/\|/g, '/');

  if (!mouza_id || !survey_type || !dag || !khatian) {
    return res.status(400).json({ ok: false, error: 'Land details are required' });
  }
  if (deed.length < 2 || deed.length > 100) {
    return res.status(400).json({ ok: false, error: 'Deed number is required' });
  }
  if (borrower.length < 2 || borrower.length > 150) {
    return res.status(400).json({ ok: false, error: 'Borrower name is required' });
  }
  if (!Number.isInteger(amount) || amount <= 0 || amount > 10000000000) {
    return res.status(400).json({ ok: false, error: 'Amount is not valid' });
  }
  if (!isValidDate(mortgage_date) || new Date(mortgage_date) > new Date()) {
    return res.status(400).json({ ok: false, error: 'Mortgage date is not valid' });
  }
  if (!isValidDate(valid_until) || new Date(valid_until) < new Date(mortgage_date)) {
    return res.status(400).json({ ok: false, error: 'Valid-until date is not valid' });
  }
  if (details.length > 500) {
    return res.status(400).json({ ok: false, error: 'Details are too long' });
  }

  try {
    const parcel_id = await findParcel(mouza_id, survey_type, dag, khatian);
    if (!parcel_id) return res.status(404).json({ ok: false, error: 'Land not found' });

    const [blocked] = await db.query(
      `SELECT risk_id FROM risk_records
       WHERE parcel_id = ? AND risk_type IN ('KHAS', 'ACQUISITION')
         AND review_status = 'APPROVED' LIMIT 1`,
      [parcel_id]
    );
    if (blocked.length > 0) {
      return res.status(409).json({ ok: false, error: 'Mortgage is not allowed on this land' });
    }

    const [dup] = await db.query(
      `SELECT risk_id FROM risk_records
       WHERE parcel_id = ? AND risk_type = 'MORTGAGE' AND reference_number = ?
         AND review_status IN ('PENDING', 'APPROVED')`,
      [parcel_id, deed]
    );
    if (dup.length > 0) {
      return res.status(409).json({ ok: false, error: 'This mortgage is already submitted' });
    }

    const description = 'Mortgage amount: ' + amount + ' BDT | Borrower: ' + borrower +
      ' | Valid until: ' + valid_until + (details ? ' | ' + details : '');
    const [ins] = await db.query(
      `INSERT INTO risk_records
         (parcel_id, risk_type, reference_number, description, record_status,
          review_status, record_date, submitted_by, source_id)
       VALUES (?, 'MORTGAGE', ?, ?, 'ACTIVE', 'PENDING', ?, ?, 1)`,
      [parcel_id, deed, description, mortgage_date, req.user.user_id]
    );
    await db.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, 'MORTGAGE_SUBMITTED', 'RISK', ?, 'Waiting for admin review')",
      [req.user.user_id, ins.insertId]
    );
    res.json({ ok: true, risk_id: ins.insertId });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- User: my submitted mortgages ----------
app.get('/api/user/my-mortgage', authRequired, requireRole('USER'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.risk_id, r.reference_number, r.record_date, r.review_status,
              l.dag_number, l.survey_type, m.mouza_name
       FROM risk_records r
       JOIN land_parcels l ON r.parcel_id = l.parcel_id
       JOIN mouzas m ON l.mouza_id = m.mouza_id
       WHERE r.submitted_by = ? AND r.risk_type = 'MORTGAGE'
       ORDER BY r.risk_id DESC
       LIMIT 50`,
      [req.user.user_id]
    );
    res.json({ ok: true, submissions: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Admin: read the details out of a bayna / mortgage description ----------
function parseDeal(desc) {
  const text = String(desc || '');
  const get = (re) => { const m = text.match(re); return m ? m[1].trim() : null; };
  return {
    amount: get(/amount: (\d+) BDT/),
    party: get(/(?:Seller|Borrower): ([^|]+?)(?: \||$)/),
    valid_until: get(/Valid until: (\d{4}-\d{2}-\d{2})/),
    note: text.split(' | ').slice(3).join(' | ')
  };
}

// ---------- Admin: pending bayna and mortgage, with land details from the database ----------
app.get('/api/admin/pending-deals', authRequired, requireRole('ADMIN'), async (req, res) => {
  try {
    const [deals] = await db.query(
      `SELECT r.risk_id, r.parcel_id, r.risk_type, r.reference_number, r.description,
              r.record_date, r.submitted_by,
              l.dag_number, l.survey_type, l.recorded_area, l.area_unit, l.land_class,
              m.mouza_name, m.upazila, m.district, m.jl_number,
              u.name AS submitter_name, u.email AS submitter_email
       FROM risk_records r
       JOIN land_parcels l ON r.parcel_id = l.parcel_id
       JOIN mouzas m ON l.mouza_id = m.mouza_id
       LEFT JOIN users u ON r.submitted_by = u.user_id
       WHERE r.review_status = 'PENDING' AND r.risk_type IN ('ADVANCE', 'MORTGAGE')
       ORDER BY r.risk_id`
    );

    for (const d of deals) {
      const p = parseDeal(d.description);
      d.amount = p.amount;
      d.party_name = p.party;
      d.valid_until = p.valid_until;
      d.note = p.note;
      delete d.description;

      const [owners] = await db.query(
        `SELECT k.khatian_number, pr.full_name AS owner
         FROM khatian_parcels kp
         JOIN khatian_records k ON kp.khatian_id = k.khatian_id
         LEFT JOIN ownership_records o ON o.khatian_id = k.khatian_id
         LEFT JOIN persons pr ON pr.person_id = o.person_id
         WHERE kp.parcel_id = ?`,
        [d.parcel_id]
      );
      d.owners = owners;
      d.khatian_number = owners.length ? owners[0].khatian_number : null;

      const [others] = await db.query(
        `SELECT risk_type, reference_number, record_status, review_status, record_date
         FROM risk_records
         WHERE parcel_id = ? AND risk_id <> ? AND review_status IN ('APPROVED', 'PENDING')
         ORDER BY risk_id`,
        [d.parcel_id, d.risk_id]
      );
      d.other_records = others;

      const ownerNames = owners.map(o => (o.owner || '').trim().toLowerCase()).filter(Boolean);
      d.name_matches = (p.party && ownerNames.length)
        ? ownerNames.includes(p.party.trim().toLowerCase())
        : null;

      d.warnings = [];
      if (d.name_matches === false) d.warnings.push('NAME_MISMATCH');
      if (others.some(o => o.risk_type === 'KHAS' && o.review_status === 'APPROVED')) d.warnings.push('LAND_IS_KHAS');
      if (others.some(o => o.risk_type === 'ACQUISITION' && o.review_status === 'APPROVED')) d.warnings.push('LAND_UNDER_ACQUISITION');
      if (others.some(o => ['ADVANCE', 'MORTGAGE'].includes(o.risk_type) &&
                           o.review_status === 'APPROVED' && o.record_status === 'ACTIVE')) d.warnings.push('OTHER_ACTIVE_DEAL');
      if (others.some(o => o.risk_type === 'CASE' && o.review_status === 'APPROVED' && o.record_status === 'ACTIVE')) d.warnings.push('ACTIVE_CASE_ON_LAND');
      if (p.valid_until && new Date(p.valid_until) < new Date(new Date().toISOString().slice(0, 10))) d.warnings.push('VALID_UNTIL_PAST');

      const [stats] = await db.query(
        `SELECT COUNT(*) AS total,
                COALESCE(SUM(review_status = 'APPROVED'), 0) AS approved,
                COALESCE(SUM(review_status = 'REJECTED'), 0) AS rejected
         FROM risk_records WHERE submitted_by = ? AND risk_type IN ('ADVANCE', 'MORTGAGE')`,
        [d.submitted_by]
      );
      d.submitter_stats = {
        total: Number(stats[0].total),
        approved: Number(stats[0].approved),
        rejected: Number(stats[0].rejected)
      };
    }
    res.json({ ok: true, deals });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ---------- Admin: approve or reject a bayna / mortgage ----------
async function decideDeal(req, res, newStatus, actionName) {
  const id = Number(req.params.id);
  try {
    if (newStatus === 'APPROVED') {
      const [blocked] = await db.query(
        `SELECT b.risk_id FROM risk_records r
         JOIN risk_records b ON b.parcel_id = r.parcel_id
         WHERE r.risk_id = ? AND b.risk_type IN ('KHAS', 'ACQUISITION')
           AND b.review_status = 'APPROVED' LIMIT 1`,
        [id]
      );
      if (blocked.length > 0) {
        return res.status(409).json({ ok: false, error: 'Land is khas or under acquisition' });
      }
    }
    const [r] = await db.query(
      `UPDATE risk_records
       SET review_status = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE risk_id = ? AND risk_type IN ('ADVANCE', 'MORTGAGE') AND review_status = 'PENDING'`,
      [newStatus, req.user.user_id, id]
    );
    if (r.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: 'No pending record found' });
    }
    await db.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, ?, 'RISK', ?, 'Reviewed by admin')",
      [req.user.user_id, actionName, id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
}

app.post('/api/admin/deals/:id/approve', authRequired, requireRole('ADMIN'), (req, res) =>
  decideDeal(req, res, 'APPROVED', 'DEAL_APPROVED'));

app.post('/api/admin/deals/:id/reject', authRequired, requireRole('ADMIN'), (req, res) =>
  decideDeal(req, res, 'REJECTED', 'DEAL_REJECTED'));

// =====================================================================
// Case closure (nishpotti)
// =====================================================================
const CLOSURE_TYPES = ['JUDGMENT', 'DISMISSED', 'SETTLED', 'WITHDRAWN', 'OTHER'];

// Officer: my own approved, still-active cases (for the "apply to close" button)
app.get('/api/officer/my-cases-to-close', authRequired, requireRole('OFFICER'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.risk_id, r.reference_number, DATE_FORMAT(r.record_date, '%Y-%m-%d') AS record_date,
              l.dag_number, l.survey_type, m.mouza_name
       FROM risk_records r
       JOIN land_parcels l ON r.parcel_id = l.parcel_id
       JOIN mouzas m ON l.mouza_id = m.mouza_id
       WHERE r.submitted_by = ? AND r.risk_type = 'CASE'
         AND r.review_status = 'APPROVED' AND r.record_status = 'ACTIVE'
         AND NOT EXISTS (SELECT 1 FROM case_closure_requests c
                         WHERE c.risk_id = r.risk_id AND c.review_status = 'PENDING')
       ORDER BY r.risk_id DESC
       LIMIT 50`,
      [req.user.user_id]
    );
    res.json({ ok: true, cases: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Officer: apply to close a case.
// Path 1: send risk_id (the officer's own case).
// Path 2: send the four land details + case_number (any other officer).
app.post('/api/officer/submit-closure', authRequired, requireRole('OFFICER'), async (req, res) => {
  const risk_id = Number(req.body.risk_id) || 0;
  const mouza_id = String(req.body.mouza_id || '').trim();
  const survey_type = String(req.body.survey_type || '').trim();
  const dag = String(req.body.dag || '').trim();
  const khatian = String(req.body.khatian || '').trim();
  const case_number = String(req.body.case_number || '').trim();
  const closure_date = String(req.body.closure_date || '').trim();
  const closure_type = String(req.body.closure_type || '').trim();
  const order_number = String(req.body.order_number || '').trim();
  const details = String(req.body.details || '').trim();

  if (!CLOSURE_TYPES.includes(closure_type)) {
    return res.status(400).json({ ok: false, error: 'Closure type is not valid' });
  }
  if (order_number.length < 2 || order_number.length > 100) {
    return res.status(400).json({ ok: false, error: 'Order number is required' });
  }
  if (details.length > 1000) {
    return res.status(400).json({ ok: false, error: 'Details are too long' });
  }
  if (!isValidDate(closure_date) || new Date(closure_date) > new Date()) {
    return res.status(400).json({ ok: false, error: 'Closure date is not valid' });
  }

  try {
    let found = null;
    if (risk_id) {
      const [rows] = await db.query(
        `SELECT risk_id, DATE_FORMAT(record_date, '%Y-%m-%d') AS record_date
         FROM risk_records
         WHERE risk_id = ? AND risk_type = 'CASE' AND review_status = 'APPROVED'
           AND record_status = 'ACTIVE' AND submitted_by = ?`,
        [risk_id, req.user.user_id]
      );
      found = rows[0] || null;
    } else {
      if (!mouza_id || !survey_type || !dag || !khatian) {
        return res.status(400).json({ ok: false, error: 'Land details are required' });
      }
      if (case_number.length < 2 || case_number.length > 100) {
        return res.status(400).json({ ok: false, error: 'Case number is required' });
      }
      const parcel_id = await findParcel(mouza_id, survey_type, dag, khatian);
      if (!parcel_id) return res.status(404).json({ ok: false, error: 'Land not found' });
      const [rows] = await db.query(
        `SELECT risk_id, DATE_FORMAT(record_date, '%Y-%m-%d') AS record_date
         FROM risk_records
         WHERE parcel_id = ? AND risk_type = 'CASE' AND reference_number = ?
           AND review_status = 'APPROVED' AND record_status = 'ACTIVE'
         LIMIT 1`,
        [parcel_id, case_number]
      );
      found = rows[0] || null;
    }
    if (!found) {
      return res.status(404).json({ ok: false, error: 'Active case not found' });
    }
    if (found.record_date && closure_date < found.record_date) {
      return res.status(400).json({ ok: false, error: 'Closure date is before case date' });
    }

    const [pending] = await db.query(
      "SELECT closure_id FROM case_closure_requests WHERE risk_id = ? AND review_status = 'PENDING'",
      [found.risk_id]
    );
    if (pending.length > 0) {
      return res.status(409).json({ ok: false, error: 'Closure already requested' });
    }

    const [ins] = await db.query(
      `INSERT INTO case_closure_requests
         (risk_id, requested_by, closure_date, closure_type, order_number, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [found.risk_id, req.user.user_id, closure_date, closure_type, order_number, details]
    );
    await db.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, 'CLOSURE_SUBMITTED', 'CLOSURE', ?, 'Waiting for admin review')",
      [req.user.user_id, ins.insertId]
    );
    res.json({ ok: true, closure_id: ins.insertId });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Officer: my closure applications and their status
app.get('/api/officer/my-closures', authRequired, requireRole('OFFICER'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.closure_id, c.closure_type, c.order_number, c.review_status,
              DATE_FORMAT(c.closure_date, '%Y-%m-%d') AS closure_date,
              r.reference_number, l.dag_number, l.survey_type, m.mouza_name
       FROM case_closure_requests c
       JOIN risk_records r ON c.risk_id = r.risk_id
       JOIN land_parcels l ON r.parcel_id = l.parcel_id
       JOIN mouzas m ON l.mouza_id = m.mouza_id
       WHERE c.requested_by = ?
       ORDER BY c.closure_id DESC
       LIMIT 50`,
      [req.user.user_id]
    );
    res.json({ ok: true, closures: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Admin: pending closure applications, with the database facts next to them
app.get('/api/admin/pending-closures', authRequired, requireRole('ADMIN'), async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT c.closure_id, c.risk_id, c.closure_type, c.order_number, c.details AS closure_details,
              DATE_FORMAT(c.closure_date, '%Y-%m-%d') AS closure_date, c.requested_by,
              r.parcel_id, r.reference_number, r.description AS case_description,
              DATE_FORMAT(r.record_date, '%Y-%m-%d') AS case_date, r.submitted_by,
              l.dag_number, l.survey_type, l.recorded_area, l.area_unit, l.land_class,
              m.mouza_name, m.upazila, m.district, m.jl_number,
              ru.name AS requester_name, rp.badge_number, rp.police_station,
              ou.name AS original_officer_name
       FROM case_closure_requests c
       JOIN risk_records r ON c.risk_id = r.risk_id
       JOIN land_parcels l ON r.parcel_id = l.parcel_id
       JOIN mouzas m ON l.mouza_id = m.mouza_id
       LEFT JOIN users ru ON c.requested_by = ru.user_id
       LEFT JOIN police_registry rp ON rp.linked_user_id = ru.user_id
       LEFT JOIN users ou ON r.submitted_by = ou.user_id
       WHERE c.review_status = 'PENDING'
       ORDER BY c.closure_id`
    );

    for (const d of items) {
      const [owners] = await db.query(
        `SELECT k.khatian_number, pr.full_name AS owner
         FROM khatian_parcels kp
         JOIN khatian_records k ON kp.khatian_id = k.khatian_id
         LEFT JOIN ownership_records o ON o.khatian_id = k.khatian_id
         LEFT JOIN persons pr ON pr.person_id = o.person_id
         WHERE kp.parcel_id = ?`,
        [d.parcel_id]
      );
      d.owners = owners;
      d.khatian_number = owners.length ? owners[0].khatian_number : null;

      const [others] = await db.query(
        `SELECT risk_type, reference_number, record_status, review_status, record_date
         FROM risk_records
         WHERE parcel_id = ? AND risk_id <> ? AND review_status IN ('APPROVED', 'PENDING')
         ORDER BY risk_id`,
        [d.parcel_id, d.risk_id]
      );
      d.other_records = others;
      d.same_officer = d.submitted_by !== null && d.submitted_by === d.requested_by;
    }
    res.json({ ok: true, closures: items });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Admin: approve (case becomes CLOSED) or reject (case stays active)
async function decideClosure(req, res, newStatus, actionName) {
  const id = Number(req.params.id);
  try {
    const [rows] = await db.query(
      "SELECT risk_id FROM case_closure_requests WHERE closure_id = ? AND review_status = 'PENDING'",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'No pending request found' });
    }
    const [r] = await db.query(
      `UPDATE case_closure_requests
       SET review_status = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE closure_id = ? AND review_status = 'PENDING'`,
      [newStatus, req.user.user_id, id]
    );
    if (r.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: 'No pending request found' });
    }
    if (newStatus === 'APPROVED') {
      await db.query(
        "UPDATE risk_records SET record_status = 'CLOSED' WHERE risk_id = ? AND risk_type = 'CASE'",
        [rows[0].risk_id]
      );
    }
    await db.query(
      "INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details) VALUES (?, ?, 'CLOSURE', ?, 'Reviewed by admin')",
      [req.user.user_id, actionName, id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
}

app.post('/api/admin/closures/:id/approve', authRequired, requireRole('ADMIN'), (req, res) =>
  decideClosure(req, res, 'APPROVED', 'CLOSURE_APPROVED'));

app.post('/api/admin/closures/:id/reject', authRequired, requireRole('ADMIN'), (req, res) =>
  decideClosure(req, res, 'REJECTED', 'CLOSURE_REJECTED'));


app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on http://localhost:' + (process.env.PORT || 3000));
});