# SchoolOS — System Design v1

**Status:** Draft (v1)  
**Last updated:** 2025-10-27  
**Owners:** Product (Mateo), Architecture (You), Engineering (Backend/Frontend/DevOps)

---

## 1. Purpose & Scope

SchoolOS is a multi-tenant School Management System (SMS) that supports roster management, flexible grading, messaging, reporting (report cards, transcripts), dashboards, and deep integrations with Google Classroom and Microsoft 365. This document defines the first production-ready design for an MVP pilot (1 school, ~60 students, 3–5 teachers) that scales to districts.

**Out of scope (v1):** Attendance, behavior tracking, payments, mobile apps. These become V2 epics.

---

## 2. Key Requirements

### 2.1 Functional
- Manage tenants, schools, users, teachers, students, guardians.
- Academic structure: academic years, terms, subjects, courses, sections, enrollments.
- Grading policies with weighted categories and optional subdivisions; per-course override; letter grade + GPA mapping.
- Assignments, submissions, grading and a live gradebook.
- Messaging (threads), announcements, notifications.
- Generate PDF report cards and transcripts.
- Integrations: Google Classroom (one-way import for MVP; two-way in V2), Microsoft 365 SSO.
- Role-based views: Admin, Teacher, Student, Parent/Guardian.
- EN/ES localization (UI + emails).

### 2.2 Non-Functional
- **Availability:** 99.5%+ (school hours focus, single-region ok for MVP).
- **Latency:** P50 API < 200 ms; gradebook < 500 ms; report generation async.
- **Security & Privacy:** RBAC, tenant isolation, audit logs, encryption at rest, SSO via OAuth/OIDC, short-lived signed URLs.
- **Scalability:** Horizontally scale API/web and workers; DB vertical scale for MVP, read replicas later.
- **Observability:** Logs, metrics, traces; health checks.
- **Compliance targets:** FERPA-like handling, GDPR-style consent for guardians (advisory).

---

## 3. Architecture Overview

### 3.1 High-Level Diagram (logical)
```
[Browser (React)]  <--HTTPS-->  [API (Django+DRF)]
      |                                 |
      v                                 v
  [Auth SSO]                      [PostgreSQL]
      |                                 |
      v                                 v
 [Google/M365]  <--Celery/Redis-->  [Workers: Reports/Sync/Email]
                            |
                            v
                         [S3/MinIO]
```

### 3.2 Tech Stack
- **Frontend:** React 18 + TypeScript, Vite, TanStack Query, React Hook Form + Zod, i18next (EN/ES), Recharts.
- **Backend:** Python 3.12, Django 5 + Django REST Framework, django-rules (RBAC), django-tenants (or schema-based isolation), Pydantic for config.
- **DB:** PostgreSQL 15 (primary), optional RLS in V2. Redis for cache + Celery broker.
- **Jobs:** Celery for async (reports, syncs, emails/notifications).
- **Storage:** S3-compatible (MinIO dev; AWS S3 prod).
- **Auth/SSO:** OAuth2/OIDC (Google, Microsoft Azure AD), SimpleJWT for session tokens.
- **PDFs:** WeasyPrint / ReportLab.
- **CI/CD:** GitHub Actions; Docker images; Terraform (optional) for cloud infra.
- **Monitoring:** Prometheus + Grafana (metrics), OpenTelemetry traces, Sentry (errors).

---

## 4. Domain Model Summary

Reference ERD: see `schoolos_erd.svg` and project canvas.

Core entities (non-exhaustive): Tenant, School, User, RoleAssignment, Student, Guardian, StudentGuardianLink, Teacher, AcademicYear, Term, Subject, Course, Section, Enrollment, GradingPolicy, Assignment, Submission, Grade, MessageThread, Message, ReportArtifact, IntegrationLink, LocalePreference.

**Cardinality highlights:**
- Tenant 1–M Schools; School 1–M Subjects; Subject 1–M Courses; Course 1–M Sections.
- Section 1–M Assignments; Assignment 1–M Submissions; Submission 1–1 Grade.
- Student M–M Guardian via StudentGuardianLink.
- Student M–M Section via Enrollment.
- GradingPolicy scoped to School or Section (override).

---

## 5. Key Components

### 5.1 API Gateway (Django + DRF)
- REST endpoints grouped by domain; OpenAPI spec via drf-spectacular.
- JWT auth; role/permission decorators; tenant scoping middleware.
- Validation with DRF serializers + Pydantic schemas for complex policy JSON.

### 5.2 Grading Engine
Computes per-course and per-term grades with categories + subdivisions, drops, and extra credit.

**Algorithm (simplified):**
1. Normalize scores: `pct = score / points * 100` (missing → 0; exempt → skip).
2. Group by category/subdivision; drop lowest if configured.
3. Weighted sum within category; sum categories to term grade.
4. Aggregate terms based on term weights to final course grade.
5. Map to letter and GPA via scale.

**Idempotency & precision:**
- Store raw score and computed percentage; compute on read for freshness.
- Use Decimal; round to 2 decimals; deterministic sorting of drops.

### 5.3 Reporting Service (Celery)
- Generate report cards/transcripts as PDFs asynchronously.
- Templates customized per school (logo, address, signature blocks).
- Store artifacts in S3; return signed URLs; emit notifications when ready.

### 5.4 Messaging Service
- MessageThread + Message; WebSocket (Channels or server-sent events) for live updates.
- Guardian access via student linking; audit senders and timestamps.

### 5.5 Integration Adapters
- **Google Classroom (MVP one-way):**
  - OAuth2 authorization per teacher or service account (domain-wide later).
  - Nightly job: courses → sections; coursework → assignments; submissions.
  - Mapping tables: `integration_links` (section↔course), assignment `source_id`.
  - Conflict strategy: classroom → source-of-truth (MVP).

- **Microsoft 365 (SSO-only in MVP):**
  - Azure AD login; Teams sync lands in V2.

---

## 6. Core API Sketch

### 6.1 Auth & Identity
- `POST /auth/sso/google` / `POST /auth/sso/microsoft`
- `POST /auth/token/refresh`
- `GET /me` → roles, scopes, schools

### 6.2 Roster & Structure
- `GET/POST /schools`, `GET/POST /subjects`, `GET/POST /courses`, `GET/POST /sections`
- `POST /enrollments` (bulk), `DELETE /enrollments/:id`

### 6.3 Grading
- `GET/PUT /sections/:id/grading-policy`
- `POST /sections/:id/assignments`
- `POST /assignments/:id/submissions`
- `PUT /submissions/:id/grade`
- `GET /sections/:id/gradebook` (teacher)
- `GET /students/:id/grades` (student/guardian scoped)

### 6.4 Reports
- `POST /reports/report-card?term=...&studentId=...` → job id
- `GET /reports/:jobId` → status + artifact URL
- `POST /reports/transcript?studentId=...`

### 6.5 Messaging
- `POST /messages/threads` (participants derived by role/section)
- `POST /messages/:threadId/messages`
- `GET /messages/inbox`

### 6.6 Integrations
- `POST /integrations/google/classroom/link-course`
- `POST /integrations/google/classroom/sync`
- `GET /integrations/jobs/:id`

**OpenAPI:** Generated and published at `/api/schema` (JSON + Swagger UI).

---

## 7. Data Storage & Partitioning

- **PostgreSQL** single DB for MVP; schema-level tenant key (`tenant_id`) on rows; composite unique constraints `(tenant_id, natural_key)` to avoid collisions.
- **Row-level security (RLS)** optional in v2; meanwhile enforce in application layer (query filters + permission checks).
- **Indices:** FK indices; partial indices for active enrollments; GIN on messaging thread search.
- **Migrations:** Django migrations; backward-compatible releases.

---

## 8. Security & Privacy

- **Transport:** HTTPS-only; HSTS.
- **At Rest:** PII fields encrypted at application level (e.g., Fernet) or PG crypto extension; S3 server-side encryption.
- **Access Control:** Role-based (admin/teacher/student/guardian) + scope (tenant/school/section).
- **Secrets:** Managed via environment variables + cloud secret manager.
- **Audit Logs:** CRUD on grades, grading policy changes, report generation.
- **Files:** Signed URLs (5–15 minutes) for artifacts and submissions.
- **Input Validation:** Strict schema validation; file type/size limits; AV scanning optional (ClamAV) in V2.

---

## 9. Internationalization (i18n) & Accessibility (a11y)

- **i18n:** i18next in front-end; Django translations in backend; date/number formats per locale.
- **a11y:** WCAG 2.1 AA targets; keyboard navigation; ARIA roles; contrast-checked color palette.
- **Time zones:** Store UTC; display using user’s timezone.

---

## 10. Performance & Scaling

- **Caching:** Read-most endpoints (e.g., gradebook summaries) cached per section with busting on grade changes.
- **N+1 controls:** DRF `select_related`/`prefetch_related` on roster/grade queries.
- **Background jobs:** Heavy ops (PDFs, syncs) offloaded to Celery workers.
- **Horizontal scale:** Stateless API + workers behind ALB/NGINX; sticky sessions not required (JWT).

---

## 11. Deployment Topology (MVP)

- **Environments:** dev, staging, prod.
- **Containers:** `api`, `web` (static), `worker`, `scheduler`, `postgres`, `redis`.
- **CD:** GitHub Actions → container registry → deploy (Docker Compose or ECS/Kubernetes later).
- **Backups:** Nightly PG dump + S3 lifecycle; recover tests quarterly.

---

## 12. Observability

- **Metrics:** request latency, error rate, queue depth, PDF job duration, sync durations.
- **Tracing:** OTel on API and worker spans (PDF generation, Google sync).
- **Logging:** JSON logs with correlation IDs; user/tenant IDs in context; PII not logged.
- **Dashboards:** Grafana—API latency, DB connections, Celery queue depth.

---

## 13. Test Strategy

- **Unit tests:** grading math, permissions, serializers.
- **Integration:** Google Classroom mock adapters; report generation snapshots.
- **E2E (smoke):** happy path for roster → assignments → grading → report.
- **Performance:** Gradebook for section @ 30 students & 20 assignments < 500 ms P50.
- **Security:** AuthZ tests, URL signing tests, SQL injection/XSS scans.

---

## 14. Risk Register (v1)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Google API quotas | Medium | Medium | Cache, batch, exponential backoff; admin-triggered resync |
| Complex grading edge cases | Medium | Medium | Comprehensive unit tests, feature flags for policy variants |
| Multi-tenant data leakage | High | Low | Strict scoping in queries, regression tests, optional RLS in v2 |
| PDF latency under load | Medium | Low | Queue sizing, concurrency limits, warm templates |
| SSO setup variability | Medium | Medium | Clear onboarding checklist, fallbacks to email+password for MVP |

---

## 15. Backlog for V2

- Attendance + behavior
- Two-way Classroom & Teams Assignments + Grades
- Graduation audits and degree plans
- Mobile apps (React Native) and push notifications
- Payments/fees and parent portal billing
- Advanced analytics (at-risk models)

---

## 16. Configuration (env vars — sample)

```
DJANGO_SECRET_KEY=...
DJANGO_DEBUG=false
DATABASE_URL=postgres://user:pass@host:5432/schoolos
REDIS_URL=redis://redis:6379/0
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=schoolos-prod
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
JWT_SIGNING_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
AZURE_AD_CLIENT_ID=...
AZURE_AD_CLIENT_SECRET=...
SENTRY_DSN=...
```

---

## 17. Acceptance Criteria (MVP Pilot)

- Onboard a school (branding + locale), create terms, subjects, courses, sections.
- Enroll 60 students; link 3–5 teachers; guardian links for at least 5 students.
- Import at least one course from Google Classroom; assignments flow into SchoolOS.
- Teachers grade at least 20 assignments—gradebook shows weighted results.
- Generate report cards (PDF) for one term; deliver signed URLs.
- Messaging threads functional; parents can view student’s grades/messages (read-only).
- Dashboards render key metrics for Admin/Teacher/Student/Parent.

---

## 18. Open Questions

- Do we adopt schema-per-tenant (postgres schemas) vs row key per tenant for v1? (Default: row key for simplicity.)
- Service account vs per-teacher OAuth for Google Classroom in MVP pilot? (Default: per-teacher OAuth.)
- Do we require RLS in PostgreSQL now or in v2 with formal audits? (Default: v2.)

---

**End of Document — System Design v1**
