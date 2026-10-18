# Twin Trust Land Verify

**"Verify before you buy"** - a citizen land-verification web app for Bangladesh.
Hackathon problem statement: **P5 - Pre-Purchase Citizen Verification**.
A buyer identifies a parcel with the four keys used in Bangladesh land records - **mouza, survey type (CS / SA / RS / BS), dag number and khatian number** - and gets one report with the parcel details and every admin-verified risk flag: khas land, government acquisition, court case, bayna (advance payment) and mortgage. The interface is fully Bangla / English.

> This is an experimental prototype, not an official government record. "No record found" never means "safe" - always verify at the Upazila Land Office.

## How it works ("twin trust")
No single person can publish a risk record. A record is first submitted by an authorised party (a verified police officer for cases, a registered user for bayna / mortgage) and then reviewed and approved by an admin. Only approved records appear in public search. Sensitive details (amounts, borrower and seller names) are visible to the admin only.
| Role | Can do |
|---|---|
| Public / User | Search parcels; submit bayna and mortgage records |
| Officer | Search parcels; Submit cases and case-closure requests (account is checked against the police registry and approved by an admin) |
| Admin | Review submissions with automatic warnings, approve / reject records, approve officers |

## Tech stack
Node.js, Express 5, MySQL (`mysql2`), JWT (`jsonwebtoken`), `bcryptjs`. Plain HTML / CSS / JavaScript front end served from `public/`.
Pages:
- Home page: choose a mouza, a survey type, enter the dag and khatian numbers, and press Search.
- "New Account" creates a user account (can submit bayna / mortgage after admin approval of records).
- "Officer Application" registers a police officer; an admin must approve the application.
- Log in as the admin to review pending cases, bayna, mortgages and closure requests.

## Project structure:
server.js          API server (search, authentication, user / officer / admin routes)
create-admin.js    Command-line script to create the first admin
public/            Front end: search, login, bayna, mortgage, officer, admin, learn pages
public/i18n.js     Bangla -> English translation data and engine
public/site.js     Shared header, side menu, footer and language switch
database/          schema.sql (database structure and sample data)
```

## Data sources

- **Parcel, mouza, khatian and owner data:** sample data created by the team for demonstration. It follows the Bangladesh land-record structure (mouza, survey CS / SA / RS / BS, dag, khatian) for Dhaka division. It contains **no real citizen or government records**.
- **Police registry** (used to verify officer sign-up): demo records created by the team.
- **Risk records** (cases, bayna, mortgage, khas, acquisition): demo records entered through the app's own submit and admin-approval workflow.
- **Planned real data sources (not integrated yet):** Land Records & Survey / e-Porcha, e-Namjari, Sub-Registry, courts, police, and DC office khas / acquisition records. The same officer-submit and admin-approve workflow is designed to work until these APIs are available.

## AI tool usage declaration

We used AI tools to understand land-related concepts and terminology, such as Khatian numbers, Dag numbers, and concepts like Khas land and acquisition.
We used AI tools while building some complex part of this project. We reviewed, ran and edited the output ourselves and take responsibility for all submitted work.

| Tool |
|---|---|
| Claude (Anthropic) ,Chatgpt-5
No real personal data was given to any AI tool.

## Security notes

Passwords are hashed with bcrypt; sessions use JWT; routes are role-protected; login attempts are rate-limited per IP; all SQL uses parameterised queries; every admin decision is written to `audit_logs`. The `.env` file is never committed.
Admin email: tonni23105101443@diu.edu.bd
Pass: tanni1041tonni1443

User email: meem@gmail.com
Pass: anikameem.

Officer(police): 
     1.Email: officer1@test.com
     1.Pass: Test@12345

   2. Email: officer2@test.com
   2.Pass: Test2@12345
