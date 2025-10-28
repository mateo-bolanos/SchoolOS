# 🤖 AGENTS INSTRUCTIONS — SchoolOS Project

> Project: School Management System (SchoolOS)
> Owner: mateo-bolanos
> Version: 1.1 — October 2025
> Repository: https://github.com/mateo-bolanos/SchoolOS
> Coordination file: STATUS.md (auto-updated by each agent)

---

## 🎯 Mission Statement
Each agent works **autonomously but cooperatively**, contributing to a unified system built around **clarity, modularity, and testability**.
All output must be **deterministic, documented, and human-readable** — so that the system can later be audited or extended by human developers.

Agents collaborate through GitHub issues, branches, and pull requests.
Every agent **reads AGENTS_INSTRUCTIONS.md before any task**.

> 🧭 If GitHub issues are not accessible, each agent must read tasks directly from the local `issues.csv` file using:
> `cat issues.csv | grep "<agent keyword>"` — for example `grep "Backend"` or `grep "Frontend"` — to view their pending tasks.

---

## 🧱 Core Rules for All Agents

1. **Each agent works only within its scope** — no overlapping code or files from other domains.
2. **Always start from the open issue** assigned to you. Do not create new issues unless explicitly instructed.
3. **Always use branches** named by convention:
   - `agent/<role>/<short-task>` (e.g. `agent/backend/auth-module`)
4. **Before committing**, ensure:
   - Code passes the relevant automated tests (`pytest`, `npm test`, `terraform validate`, etc.).
   - Documentation/comments are updated.
   - Commit message references the issue (e.g., `Closes #14`).
5. **Communicate via `STATUS.md`** using your agent identifier and update progress (see Reporting Workflow below).
6. **When finishing a task**, merge PR only if tests pass and review is approved by `architect-agent`.
7. **Do not delete other agents’ branches** or modify configuration files outside your scope.
8. **Respect security**: never commit secrets, API keys, or credentials.
9. **Accessibility & internationalization** considerations must be included in UI and UX proposals.

---

## 🧱 System Architecture Overview

### High-Level Logical Architecture
```
┌─────────────────────────┐        ┌─────────────────────────┐
│  Client Applications    │<──────►│  REST API Gateway       │
│  - Web SPA (React + MUI)│  HTTPS │  (Django REST Framework)│
└──────────┬──────────────┘        └──────────┬──────────────┘
           │                                   │
           │                                   ▼
           │                   ┌─────────────────────────┐
           │                   │  Application Services   │
           │                   │  - Auth & Identity      │
           │                   │  - Academic Management  │
           │                   │  - Reporting Engine     │
           │                   │  - Notification Hub     │
           │                   └──────────┬──────────────┘
           │                                   │
           ▼                                   ▼
┌─────────────────────────┐        ┌─────────────────────────┐
│ External Integrations   │        │ Persistence Layer       │
│ - Google Workspace APIs │◄──────►│ PostgreSQL (RDS)        │
│ - Email & Messaging     │  OAuth │ S3 (documents/media)    │
└─────────────────────────┘        └─────────────────────────┘
```

- **Security**: JWT-based authentication with role-based authorization enforced at the API layer. OAuth2 for Google integrations.
- **Scalability**: Stateless frontend and backend containers orchestrated via Docker (future CI/CD). Database hosted on managed PostgreSQL with read replicas planned for Phase 2.
- **Extensibility**: Modular service packages (auth, academics, reports, integrations) with shared utilities and clearly defined interfaces.

### Recommended Repository Structure
```
/ (root)
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── academics/
│   │   ├── attendance/
│   │   ├── reports/
│   │   └── integrations/
│   ├── config/
│   ├── requirements/
│   └── tests/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   └── routes/
│   └── tests/
├── infrastructure/
│   ├── docker/
│   ├── terraform/
│   └── scripts/
├── integrations/
│   ├── google/
│   ├── mocks/
│   └── docs/
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── guides/
│   └── status/
└── tests/
    ├── backend/
    ├── frontend/
    └── e2e/
```
Each agent should align new files with this structure when creating future modules.

---

## 🔄 Reporting Workflow (Architecture 4)
1. **At the start of a session**, append or update your section in `STATUS.md` with:
   - `Current issue`: GitHub issue number you are tackling.
   - `Progress`: percentage estimate.
   - `Notes`: blockers, design decisions, or dependencies.
2. **During the session**, update `Progress` when reaching significant milestones (>10% increments).
3. **At the end of the session**, append a timestamped bullet in `Notes` summarizing accomplishments and next steps.
4. **If blocked**, tag the responsible agent in your note and specify what is needed to proceed.
5. **Architect agent** reviews `STATUS.md` daily and coordinates dependency resolutions.

Use ISO 8601 dates (e.g., `2025-10-22`) in notes.

---

## 🧩 Agent-Specific Directives

### 🧱 1. Backend Agent (`backend-agent`)
**Main Responsibilities**
- Implement Django + DRF backend logic.
- Models: Users, Roles, Subjects, Grades, Attendance.
- Business logic: Weighted grade calculation and report generation.
- Authentication: JWT with role-based access.
- Performance and security best practices.

**Rules**
- Follow PEP 8.
- All endpoints documented with DRF `schema_view`.
- Use environment variables for secrets.
- No hardcoded paths, keys, or tokens.
- Test coverage > 80%.
- Place reusable business logic inside `backend/apps/<domain>/services/` modules.

**Branching**
- `agent/backend/models`
- `agent/backend/auth`
- `agent/backend/reports`

---

### 🎨 2. Frontend Agent (`frontend-agent`)
**Main Responsibilities**
- Build React + MUI interfaces for all roles.
- Implement routing, authentication UI, and dashboards.
- Create CRUD pages for Students, Teachers, Grades, and Attendance.
- Integrate charting (Recharts / Chart.js).
- Ensure responsive design and accessibility (WCAG 2.1 AA).

**Rules**
- Use functional components and hooks.
- Organize components under `/src/components/<feature>`.
- Connect only to documented backend endpoints.
- Use `.env` for API URLs, no inline constants.
- Follow the color and style palette from `/docs/ui-guide.md`.
- Write shared UI primitives inside `src/components/common/` for reuse.

---

### ☁️ 3. DevOps Agent (`devops-agent`)
**Main Responsibilities**
- Dockerize backend and frontend.
- Configure CI/CD via GitHub Actions.
- Deploy on AWS (EC2, RDS, S3).
- Manage environment secrets and backups.
- Write `DEPLOYMENT.md`.

**Rules**
- No hardcoded credentials.
- Use Terraform or CloudFormation where possible.
- Tag builds by branch name and version.
- All images stored in private ECR repository.
- Document infrastructure changes in `/docs/decisions/` ADRs.

---

### 🔗 4. Integration Agent (`integrations-agent`)
**Main Responsibilities**
- Integrate Google APIs:
  - Google Classroom API (assignment sync)
  - Google OAuth2 login
  - Gmail API (in-app messaging)
- Handle token refresh, rate limits, and OAuth scopes securely.

**Rules**
- Store all credentials in `.env` or AWS Secrets Manager.
- Never commit client secrets.
- Document endpoints and scopes in `/docs/integrations.md`.
- Write mocks for API tests.
- Isolate third-party wrappers under `integrations/google/`.

---

### 🧪 5. QA Agent (`qa-agent`)
**Main Responsibilities**
- Test all endpoints (Postman + Pytest).
- Validate frontend workflows (Cypress or Playwright).
- Monitor performance and run load testing.
- Maintain `/tests` folder structure and coverage reports.

**Rules**
- Follow Gherkin-style test case naming.
- Submit bug reports as GitHub issues labeled `bug`.
- Automated test reports must be attached to PRs.
- Store fixtures in `tests/shared/fixtures/` for reuse.

---

### 📚 6. Documentation Agent (`docs-agent`)
**Main Responsibilities**
- Keep all Markdown docs updated.
- Write installation and contribution guides.
- Generate OpenAPI documentation.
- Maintain `/docs/architecture-diagram.png`.

**Rules**
- Never delete existing documentation.
- Use neutral, concise language.
- Include diagrams or schema images for major updates.
- Maintain changelog after each release.
- Sync with architect agent on terminology changes.

---

### 🧭 7. Architect Agent (`architect-agent`)
**Main Responsibilities**
- Oversee system integrity and module boundaries.
- Approve merges.
- Define task dependencies between agents.
- Maintain `AGENTS_INSTRUCTIONS.md` and `STATUS.md`.
- Evaluate performance, scalability, and consistency.

**Rules**
- Do not modify functional code unless required for integration.
- Approve or reject PRs based on consistency with overall design.
- Assign new issues if dependencies arise.
- Ensure architecture diagrams in `/docs/architecture/` stay current.

---

## 🧠 Communication Flow
```
frontend-agent  --> backend-agent     (API contract discussion)
backend-agent   --> integrations-agent (OAuth endpoints)
qa-agent        --> all                (test results & reports)
devops-agent    --> architect-agent    (deployment & scaling)
docs-agent      --> all                (documentation updates)
architect-agent --> all                (architecture & governance)
```

---

## 🧭 Change Log for Instructions
- **2025-10-22** — Architect agent defined system architecture, repository structure, and reporting workflow v1.1.
