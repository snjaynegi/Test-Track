# Test-Track

> 🐞 A modern bug tracking and test reporting platform for QA teams and reporting managers.

Test-Track is a full-stack web application built to help teams manage projects, organize modules and sub-modules, report bugs, review QA activity, and monitor product quality through dashboards and analytics. It combines a polished React frontend with an Express backend and optional PostgreSQL persistence.

## 📋 Project Overview

Test-Track supports structured QA workflows across projects and testing scopes. The platform is designed for two primary roles:

- 👩‍💼 `Reporting Manager`: supervises QA activity, manages projects and structure, and reviews dashboards, analytics, and reports.
- 🧪 `QA User`: works within assigned projects, reports bugs, tracks progress, and contributes evidence for defects.

The current application provides:

- 🎨 A responsive interface with light and dark mode support
- 📌 Sticky navigation and clean empty states
- 📊 Dashboard and analytics views for bug and testing insights
- 🗂️ Project, module, and sub-module organization
- 🔐 Demo login fallback plus PostgreSQL-backed authentication when configured
- 🐘 In-repo PostgreSQL schema and seed tooling

## ✨ Core Features

### 🧭 Workspace Management

- Create and manage projects
- Organize work using modules and nested sub-modules
- Maintain project visibility by role and project membership

### 🐞 Bug Tracking

- Capture detailed bug reports with title, description, severity, priority, environment, and reproduction steps
- Associate bugs with projects and modules
- Track lifecycle states such as `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, and `REOPENED`

### 👥 Role-Based Access

- Reporting Managers supervise and review testing activity
- QA Users report and manage bugs within accessible projects
- Workspace bootstrap data is scoped by user access

### 📈 Reporting And Analytics

- Dashboard metrics for total, open, closed, in-progress, and critical bugs
- Highcharts-based visual summaries
- Clean empty-state handling for first-use and no-data scenarios

### 🌓 User Experience

- Functional light and dark themes
- Sticky header and sidebar for better navigation
- Simple, elegant sign-in flow with ready-to-use demo accounts

### 🐘 PostgreSQL Integration

- PostgreSQL-backed authentication and session bootstrap when `DATABASE_URL` is configured
- Health endpoint with schema readiness reporting
- Included SQL schema and seed scripts for quick setup

## 🛠️ Tech Stack

- ⚛️ React 18
- 🟦 TypeScript
- ⚡ Vite
- 🌐 Express
- 🧵 Zustand
- 🎨 Tailwind CSS
- 📊 Highcharts
- 🐘 PostgreSQL
- ✅ Vitest

## 🚀 Installation Guide

### 1. Prerequisites

Install the following before starting:

- `Node.js` 18+
- `npm`
- `PostgreSQL` 14+ for database-backed usage

### 2. Clone The Repository

```bash
git clone https://github.com/snjaynegi/Test-Track.git
cd Test-Track
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then update the values in `.env` to match your environment.

### 5. Initialize PostgreSQL

```bash
npm run db:setup
```

This command creates the schema and seeds the default records required for login and initial workspace setup.

### 6. Start The Application

```bash
npm run dev
```

The development environment starts:

- Frontend via Vite
- Backend API on `http://localhost:3001`

## ▶️ Usage Instructions

### Sign In

After database setup, use the seeded demo accounts:

- 👩‍💼 Reporting Manager: `manager@demo.local` / `demo123`
- 🧪 QA User: `qa@demo.local` / `demo123`

### Typical Workflow

1. Sign in with the appropriate role.
2. Create or review projects.
3. Add modules and sub-modules to structure the testing scope.
4. Report and track bugs from the QA workspace.
5. Review dashboards and analytics for testing visibility.

### Common Commands

```bash
npm run dev
npm run build
npm run check
npm run test
npm run db:setup
npm run db:seed
```

### Health Check

Use the backend health endpoint to confirm application readiness:

```text
GET /api/health
```

Returned database state includes:

- `configured`
- `connected`
- `schemaReady`

## ⚙️ Configuration Details

The backend uses environment variables for runtime configuration.

### Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | Express API server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/bug_tracking` |
| `PGSSL` | Enables SSL for PostgreSQL when set to `true` | `false` |

### Example Configuration

```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bug_tracking
PGSSL=false
```

### Database Setup Files

- `database/schema.sql`: creates tables and indexes
- `database/seed.sql`: inserts demo users and starter records
- `scripts/setup-postgres.mjs`: applies schema and seed files to PostgreSQL

## 🤝 Contribution Guidelines

Contributions are welcome. For clean and reviewable changes:

1. Fork the repository.
2. Create a dedicated branch for your work.
3. Keep changes focused and documented.
4. Run validation commands before opening a pull request:

```bash
npm run check
npm run test
```

5. Include the following in your pull request:

- A clear summary of the change
- Screenshots for UI updates
- Notes about database or environment changes
- Testing details and expected behavior

Recommended areas for contribution:

- 🐘 Expanding PostgreSQL CRUD support
- 📄 Report export enhancements
- ♿ Accessibility improvements and contrast auditing
- 🧪 Additional automated tests
- 🚀 Deployment hardening

## 📄 License Information

This repository currently does not include a `LICENSE` file.

That means:

- The code is visible in the repository
- Reuse and redistribution rights are not explicitly granted
- A formal license should be added before publishing as open source

If you plan to distribute the project publicly, add a standard license such as `MIT`, `Apache-2.0`, or `GPL-3.0`.

## ✅ Rendering Notes

This README is intentionally written with standard Markdown so it renders well across:

- GitHub
- GitLab
- VS Code preview
- Local Markdown viewers

Compatibility choices used here:

- Standard Unicode emojis instead of HTML-based icon layouts
- Plain Markdown headings, lists, tables, and fenced code blocks
- No custom alignment tricks or platform-specific extensions

## 🙌 Summary

Test-Track provides a strong foundation for structured QA operations, bug reporting, project organization, analytics, and PostgreSQL-backed growth. It is designed to be readable for stakeholders, practical for testers, and maintainable for developers.
