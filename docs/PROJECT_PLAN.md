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
| `infrastructure` | Containerization, environments, and platform plumbing |
| `observability` | Monitoring, logging, and tracing work |
| `security` | Authentication, authorization, and compliance |
| `tenant-management` | Multi-tenant data models and school administration |
| `grading` | Gradebook, assignments, and scoring features |
| `messaging` | Real-time chat, announcements, and notifications |
| `reporting` | Reports, transcripts, and exports |
| `analytics` | Dashboards, charts, and insight surfaces |
| `deployment` | Release engineering and launch readiness |

---

## 🗒️ Issue Backlog & Agent Prompts

### EPIC 1 — Core Setup & Infrastructure
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP1-01: Bootstrap Docker Compose Stack | Author a `docker-compose.yml` that orchestrates the Django API, React frontend, PostgreSQL, and Redis with shared networks, volumes, and local developer documentation. | backend, infrastructure, high-priority | Stand up the multi-service Docker Compose stack, document environment variables, and verify `docker compose up --build` runs cleanly end-to-end. |
| EP1-02: Configure Python Dependency Manager | Adopt Poetry or Pipenv for the backend, check in lock files, and document installation workflows for contributors and CI. | backend, documentation, high-priority | Choose Poetry or Pipenv, configure project metadata, update READMEs, and ensure CI uses the pinned dependency workflow. |
| EP1-03: Establish Environment Config Baseline | Provide a `.env.example` and base `settings.py` that load secrets and service URLs from environment variables with sensible defaults. | backend, documentation, high-priority | Create `.env.example`, refactor settings to read env vars securely, and note required keys for Docker and local shells. |
| EP1-04: GitHub Actions CI/CD Pipeline | Build a GitHub Actions pipeline that runs linting, backend tests, frontend build, and deploy stubs with caching for speed. | backend, infrastructure, high-priority | Craft a multi-job workflow covering lint → test → build, add dependency caching, and leave a documented deploy step placeholder. |
| EP1-05: Healthcheck Endpoint | Ship a `/health` endpoint that pings the database and Redis, returning structured status along with automated coverage. | backend, high-priority | Implement a lightweight health view, add unit tests, and update the API docs describing success/failure payloads. |
| EP1-06: Observability Instrumentation | Integrate Sentry and OpenTelemetry for backend (and frontend where feasible) with environment-based toggles. | backend, observability, enhancement | Wire Sentry + OTel SDKs, expose configuration via env vars, and document how to provide DSNs and sampling rates. |

### EPIC 2 — Tenant & School Management
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP2-01: Implement Tenant & School Models | Define `Tenant` and `School` models with migrations, constraints, and seeds aligning to multi-tenant isolation. | backend, tenant-management, high-priority | Create models, migrations, and admin registrations that capture tenancy metadata and ensure referential integrity. |
| EP2-02: Multi-Tenant Middleware | Add middleware that resolves tenant context by subdomain or header, scoping database queries appropriately. | backend, tenant-management, high-priority | Build middleware + helpers to derive tenant, update request lifecycle hooks, and add tests around tenant resolution. |
| EP2-03: School Management Admin Panel | Provide admin list/detail/edit UI for schools with filtering by tenant and audit metadata. | frontend, tenant-management, enhancement | Implement React (or Django admin) views for CRUD on schools, respecting tenant context and user permissions. |
| EP2-04: User & RoleAssignment Models | Design user core profile and role-assignment mapping with migrations and seed data. | backend, security, high-priority | Introduce `User` and `RoleAssignment` models, link to tenants/schools, and document default roles. |
| EP2-05: JWT Authentication & Refresh Flow | Add JWT auth endpoints (login, refresh, revoke) and middleware integration. | backend, security, high-priority | Implement JWT issuing/refresh endpoints, configure token settings, and add tests covering expiration/refresh edge cases. |
| EP2-06: RBAC Decorator & Permission Mapping | Provide decorators/utilities to enforce role-based access across endpoints with centralized permission definitions. | backend, security, high-priority | Create RBAC decorator, permission map, and sample usage across key endpoints with unit tests validating enforcement. |

### EPIC 3 — Academic Structure
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP3-01: Academic Structure Models | Model `AcademicYear`, `Term`, `Subject`, `Course`, `Section`, and `Enrollment` with migrations and constraints. | backend, high-priority | Build models + migrations with relational integrity, seed fixtures, and update admin registrations. |
| EP3-02: CRUD Endpoints for Academic Entities | Expose DRF CRUD endpoints for academic entities with tenant-aware querysets. | backend, high-priority | Implement serializers, viewsets, and routers for the academic models plus tests for tenant scoping and validation. |
| EP3-03: Course & Section React UI | Deliver React forms/tables for managing courses and sections with validation and loading states. | frontend, enhancement | Build UI components for listing and editing courses/sections, integrating with DRF endpoints and form validation. |
| EP3-04: Teacher Assignment Workflows | Enable assigning teachers to sections via backend endpoints and supporting UI affordances. | backend, frontend, high-priority | Extend models and APIs for teacher assignments, add UI controls, and cover permissions/tests. |
| EP3-05: Enrollment Management UX | Implement API + UI flows to enroll/unenroll students with bulk actions and audit logging. | backend, frontend, high-priority | Create enrollment endpoints, React components, and ensure operations respect tenant + role permissions. |
| EP3-06: Enrollment Logic Tests | Add comprehensive unit tests covering enrollment edge cases (duplicate, capacity, withdrawals). | backend, high-priority | Author tests for enrollment services ensuring validations and side-effects behave as expected. |

### EPIC 4 — Grading & Assignments Engine
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP4-01: GradingPolicy Model & Schema | Create `GradingPolicy` model with JSON schema validation for weighting rules. | backend, grading, high-priority | Implement model, schema validation, and admin/UI hooks for managing policies per course/section. |
| EP4-02: Assignment CRUD | Build endpoints and UI to manage assignments with category, points, and due dates. | backend, frontend, grading, high-priority | Implement DRF endpoints and React forms for assignments, ensuring validation and role protection. |
| EP4-03: Submission File Uploads | Support file uploads for submissions using MinIO/S3 with secure access controls. | backend, grading, security, high-priority | Configure storage backend, implement upload endpoints, and document bucket/credential setup. |
| EP4-04: Gradebook API | Provide `/sections/:id/gradebook` API returning student scores and aggregate stats. | backend, grading, high-priority | Design gradebook serializer/service, ensure pagination/performance, and add tests for accuracy. |
| EP4-05: Weighted Grade Computation | Implement weighted grade calculations with drop-lowest logic and missing work handling. | backend, grading, high-priority | Write service functions for grade math, cover edge cases, and expose results via gradebook endpoints. |
| EP4-06: Letter & GPA Mapping | Map numeric scores to letter grades and GPA with configurable scales. | backend, grading, enhancement | Add configurable mapping tables/services and tests verifying thresholds. |
| EP4-07: Grading Engine Tests | Deliver automated tests covering grading edge cases including missing, zero, and extra credit work. | backend, grading, high-priority | Create unit tests that stress grade computations and ensure regression coverage. |

### EPIC 5 — Messaging & Announcements
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP5-01: MessageThread & Message Models | Introduce messaging data models with tenant and participant relationships. | backend, messaging, high-priority | Create models/migrations, enforce permissions, and document data retention policies. |
| EP5-02: WebSocket Chat Channel | Add real-time messaging channel for sections using Django Channels or similar. | backend, messaging, high-priority | Configure WebSocket infrastructure, authentication, and basic frontend subscription for live chat. |
| EP5-03: Section Announcements | Provide UI/backend for section-wide announcements with scheduling support. | backend, frontend, messaging, enhancement | Build API + UI components to post and display announcements, with optional publish windows. |
| EP5-04: Guardian Linking | Enable guardians to view student messages in read-only mode with appropriate access controls. | backend, messaging, security, enhancement | Implement guardian linking data model, API endpoints, and UI read-only views respecting privacy. |
| EP5-05: Notification Queue | Configure Celery + Redis queues for async notifications (email/push) triggered by messaging events. | backend, messaging, infrastructure | Set up Celery workers, define notification tasks, and document how to run workers locally. |

### EPIC 6 — Reports & Transcripts
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP6-01: ReportArtifact Model | Create `ReportArtifact` model capturing generated report metadata and storage pointers. | backend, reporting, high-priority | Add model/migrations, integrate with storage backend, and expose admin tooling. |
| EP6-02: PDF Report Cards | Generate PDF report cards using WeasyPrint with styling templates. | backend, reporting, enhancement | Implement WeasyPrint pipeline, templates, and command/API to render report cards per student. |
| EP6-03: Transcript View | Build transcript UI summarizing multi-term GPA and course history securely. | frontend, reporting, enhancement | Design frontend view, hook into API, and ensure proper authorization. |
| EP6-04: Secure File Storage | Provide signed URL access and data encryption for stored reports. | backend, reporting, security, high-priority | Configure storage security, implement signed URL endpoints, and document expiry policies. |
| EP6-05: Admin Bulk Export | Offer bulk CSV/PDF exports for admins covering reports and transcripts. | backend, reporting, enhancement | Build export endpoints/background jobs and UI triggers with progress feedback. |

### EPIC 7 — Integrations
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP7-01: Google Classroom OAuth Setup | Configure OAuth consent, secrets management, and token storage for Google Classroom. | backend, integration, high-priority | Implement OAuth flow, persist tokens securely, and document setup instructions. |
| EP7-02: Import Courses & Sections | Sync Google Classroom courses into SchoolOS sections with mapping UI. | backend, integration, enhancement | Build sync job/endpoints that map Classroom courses to local sections with conflict resolution. |
| EP7-03: Import Assignments & Submissions | Pull assignments/submissions from Classroom into local gradebook structures. | backend, integration, grading, enhancement | Implement scheduled import pipeline, handle attachments, and log sync status. |
| EP7-04: Export Grades to Classroom | Push computed grades back to Google Classroom with reconciliation. | backend, integration, grading, enhancement | Build export service with delta detection, error reporting, and admin controls. |
| EP7-05: Microsoft 365 SSO & Teams Sync | Add Microsoft SSO and optionally sync Teams rosters/messages. | backend, integration, security, enhancement | Configure Azure AD app, implement SSO login, and outline Teams sync roadmap. |
| EP7-06: Nightly Sync Job | Schedule Celery-based nightly sync covering Google/Microsoft integrations with monitoring. | backend, integration, infrastructure | Create scheduled tasks, logging, and alerting around sync success/failure. |

### EPIC 8 — Dashboards & Analytics
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP8-01: Admin Dashboard | Build admin analytics view showing enrollment and grade trends. | frontend, analytics, enhancement | Implement dashboard layout, integrate charts, and surface key KPIs with filters. |
| EP8-02: Teacher Dashboard | Provide teacher view highlighting missing submissions and averages. | frontend, analytics, enhancement | Create teacher-specific widgets drawing from gradebook APIs with actionable insights. |
| EP8-03: Student Dashboard | Surface upcoming assignments and grade averages for students. | frontend, analytics, enhancement | Design student-friendly dashboard pulling assignments and GPA data with accessibility in mind. |
| EP8-04: Parent Dashboard | Present guardians with per-child performance trends and alerts. | frontend, analytics, enhancement | Build parent dashboard components with child selector and trend charts respecting permissions. |
| EP8-05: Charting Library Integration | Integrate Recharts or Chart.js components with shared theme/utilities. | frontend, analytics, enhancement | Establish charting toolkit, create reusable components, and document usage patterns. |

### EPIC 9 — Security & Compliance
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP9-01: Row-Level Permissions | Enforce row-level security to isolate school data across tenants. | backend, security, tenant-management, high-priority | Implement query filters or database policies ensuring isolation, with tests and audits. |
| EP9-02: Audit Logging | Capture audit logs for grade/policy edits with retention and search tooling. | backend, security, enhancement | Add logging middleware/services, persist audit events, and expose review interface. |
| EP9-03: Data Encryption | Encrypt sensitive fields at rest with key rotation support. | backend, security, high-priority | Introduce field encryption utilities, manage keys securely, and document rotation procedures. |
| EP9-04: Signed URL Expiry | Provide short-lived signed URLs for file access with revocation. | backend, security, reporting, high-priority | Implement signed URL helper, integrate with storage, and add tests for expiry handling. |
| EP9-05: FERPA/GDPR Checklist | Produce compliance checklist mapping requirements to product features/processes. | documentation, security, high-priority | Draft compliance document, identify owners, and outline verification cadence. |

### EPIC 10 — Deployment & Pilot Launch
| Issue Title | Description | Labels | Agent Prompt |
|-------------|-------------|--------|--------------|
| EP10-01: Production Docker Image | Build optimized production image bundling Nginx, Gunicorn, and React assets. | backend, infrastructure, deployment, high-priority | Create multi-stage Dockerfile, configure Nginx/Gunicorn, and document runtime configuration. |
| EP10-02: PostgreSQL Backups & Cron | Set up automated database backups with retention policies and cron scheduling. | backend, infrastructure, deployment, high-priority | Configure backup scripts/jobs, test restoration, and document storage location. |
| EP10-03: Deploy Demo Environment | Deploy to AWS or Render with automated provisioning and environment secrets. | backend, infrastructure, deployment, high-priority | Script infrastructure deployment, document access, and verify smoke tests in the demo environment. |
| EP10-04: Pilot School Onboarding | Coordinate onboarding for pilot users with communication and training materials. | documentation, tenant-management, deployment | Create onboarding checklist, user guides, and schedule training sessions with feedback loop. |
| EP10-05: Feedback & Survey Collection | Implement feedback capture and surveys for pilot participants. | frontend, analytics, deployment, enhancement | Build survey forms, route submissions to storage/analytics, and summarize reporting cadence. |
| EP10-06: Prepare V2 Backlog | Compile prioritized backlog for V2 (attendance, mobile app, payments). | documentation, enhancement | Gather feedback, scope V2 features, and produce prioritized roadmap document. |

