require('dotenv').config();
const readline = require('readline');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

(async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const name = (await ask('Admin name: ')).trim();
  const email = (await ask('Admin email: ')).trim().toLowerCase();
  const password = await ask('Admin password (min 12 characters): ');
  rl.close();

  if (name.length < 2) { console.log('Name is too short.'); process.exit(1); }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { console.log('Email is not valid.'); process.exit(1); }
  if (password.length < 12) { console.log('Password must be at least 12 characters.'); process.exit(1); }

  const [exists] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
  if (exists.length > 0) { console.log('This email is already registered.'); process.exit(1); }

  const hash = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'ADMIN')",
    [name, email, hash]
  );
  console.log('Admin account created: ' + email);
  await db.end();
})().catch((e) => { console.log('Error: ' + e.message); process.exit(1); });