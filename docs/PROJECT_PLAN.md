# 🏫 SchoolOS — Project Board (GitHub Projects)

> **Goal:** Build a modern, multi-tenant school management system with grading, messaging, reporting, and integrations (Google Classroom & Microsoft 365).

---

## 📦 EPIC 1 — Core Setup & Infrastructure
**Milestone:** Sprint 1

- [ ] Setup Docker Compose with Django + React + PostgreSQL + Redis  
- [ ] Configure Poetry / Pipenv for dependency management  
- [ ] Create `.env.example` and base `settings.py` structure  
- [ ] Add CI/CD (GitHub Actions): lint → test → build → deploy  
- [ ] Add healthcheck endpoint `/health`  
- [ ] Add Sentry / OpenTelemetry logging

---

## 🧑‍💼 EPIC 2 — Tenant & School Management
**Milestone:** Sprint 1–2

- [ ] Implement `Tenant` and `School` models  
- [ ] Add multi-tenant middleware (subdomain or header isolation)  
- [ ] Create school management admin panel (list + edit schools)  
- [ ] Implement `User` + `RoleAssignment` models  
- [ ] Add JWT authentication + refresh flow  
- [ ] Implement RBAC decorator + permission mapping  
- [ ] Add i18n for English/Spanish (Django + React i18next)

---

## 🎓 EPIC 3 — Academic Structure
**Milestone:** Sprint 2

- [ ] Models: `AcademicYear`, `Term`, `Subject`, `Course`, `Section`, `Enrollment`  
- [ ] CRUD endpoints with Django REST Framework  
- [ ] React forms and tables for Course & Section views  
- [ ] Assign Teachers to Sections  
- [ ] Enroll/Unenroll Students (API + UI grid)  
- [ ] Unit tests for enrollment logic

---

## 🧮 EPIC 4 — Grading & Assignments Engine
**Milestone:** Sprint 3

- [ ] `GradingPolicy` model + JSON schema validator  
- [ ] `Assignment` CRUD (category, points, due date)  
- [ ] `Submission` with file upload (MinIO/S3)  
- [ ] Gradebook API (`/sections/:id/gradebook`)  
- [ ] Weighted grade computation + drop lowest support  
- [ ] Letter + GPA mapping logic  
- [ ] Tests for grading math edge cases (missing, zero, extra credit)

---

## 💬 EPIC 5 — Messaging & Announcements
**Milestone:** Sprint 4

- [ ] `MessageThread` + `Message` models  
- [ ] WebSocket channel for live chat  
- [ ] Section-wide announcement system  
- [ ] Guardian linking for read-only student messages  
- [ ] Notification queue (Redis + Celery)

---

## 🧾 EPIC 6 — Reports & Transcripts
**Milestone:** Sprint 4

- [ ] `ReportArtifact` model  
- [ ] Generate PDF report cards with WeasyPrint  
- [ ] Transcript view: multi-term GPA summary  
- [ ] Secure file storage + signed URLs  
- [ ] Admin bulk export CSV + PDF

---

## 🔗 EPIC 7 — Integrations
**Milestone:** Sprint 5

- [ ] Google Classroom OAuth setup  
- [ ] Import Courses → Sections  
- [ ] Import Assignments & Submissions  
- [ ] Export Grades back to Classroom  
- [ ] Microsoft 365 SSO + Teams sync  
- [ ] Scheduled Celery sync job (nightly)

---

## 📊 EPIC 8 — Dashboards & Analytics
**Milestone:** Sprint 5

- [ ] Admin dashboard (enrollment trends, grade distribution)  
- [ ] Teacher dashboard (missing submissions, averages)  
- [ ] Student dashboard (upcoming assignments, average)  
- [ ] Parent dashboard (grade trend per child)  
- [ ] Charts via Recharts or Chart.js

---

## 🔒 EPIC 9 — Security & Compliance
**Milestone:** Sprint 6

- [ ] Row-level permissions (school-based isolation)  
- [ ] Audit logs for grade/policy edits  
- [ ] Data encryption for sensitive fields  
- [ ] Short-lived signed URLs for files  
- [ ] FERPA/GDPR compliance checklist

---

## 🚀 EPIC 10 — Deployment & Pilot Launch
**Milestone:** Sprint 6

- [ ] Prepare production Docker image (Nginx + Gunicorn + React build)  
- [ ] Setup PostgreSQL backups & cron  
- [ ] Deploy to AWS or Render (demo instance)  
- [ ] Pilot school onboarding (3 teachers, 60 students)  
- [ ] Collect feedback and user survey  
- [ ] Prepare V2 backlog (attendance, mobile app, payments)

---

## 🗂 Columns for GitHub Project Board
| Column | Description |
|---------|-------------|
| **📋 Backlog** | Unstarted features and epics |
| **🧑‍💻 In Progress** | Active issues or PRs |
| **🧪 QA / Review** | Code review or testing |
| **✅ Done** | Merged or deployed |

---

## 🧭 Labels
| Label | Meaning |
|--------|---------|
| `backend` | Django / API work |
| `frontend` | React UI work |
| `integration` | Google/Microsoft sync |
| `bug` | Fixes or QA |
| `documentation` | Docs or onboarding |
| `high-priority` | Must-ship for MVP |
| `enhancement` | Non-critical improvements |
