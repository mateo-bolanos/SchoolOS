# \U0001f916 School Management System \u2014 AGENTS.md

> Version: 1.0  
> Owner: Mateo Bola�os  
> Architecture Lead: [AI Architect Agent]  
> Stack: Django + DRF backend, React + MUI frontend, PostgreSQL (AWS RDS), Google Workspace integrations  

---

## \U0001f9e9 Project Summary

A full-featured **School Management System (SMS)** supporting:
- Student management, grades, attendance, reports, and transcripts  
- Customizable grading structures (percentages, categories)  
- Role-based access (Admin, Teacher, Student, Parent)  
- Integration with **Google Classroom & Gmail API**  
- AWS-hosted, scalable backend with multi-tenant potential (Phase 2)  

---

## \U0001f9e0 AGENT ROLES AND MISSIONS

### \U0001f9f1 1. Backend Architect Agent
**Goal:** Design a robust backend using Django + DRF.
**Responsibilities:**
- Build models for users, roles, subjects, assignments, grades, attendance.
- Implement grade calculation logic (custom weight % per category).
- Create endpoints for reports, dashboards, and transcript generation.
- Integrate with Google Classroom API (Phase 2).
- Unit and integration testing (pytest).

---

### \U0001f3a8 2. Frontend Developer Agent
**Goal:** Create a responsive, user-friendly web app using React + MUI.
**Responsibilities:**
- Dashboard interfaces for each role (Admin, Teacher, Student, Parent).
- CRUD UIs for classes, assignments, and grades.
- Grade visualization (charts, progress bars).
- Internal messaging (in-app email style).
- Integrate Google Login.

---

### \u2601\ufe0f 3. DevOps Agent
**Goal:** Deploy, monitor, and scale the app on AWS.
**Responsibilities:**
- Configure AWS EC2, RDS, and S3 for storage.
- Dockerize frontend and backend.
- Setup CI/CD via GitHub Actions.
- Configure environment secrets, backup, and logging.

---

### \U0001f4da 4. Documentation & QA Agent
**Goal:** Maintain documentation and testing quality.
**Responsibilities:**
- Maintain `README.md`, `API_DOCS.md`, `INSTALL.md`.
- Define testing procedures and acceptance criteria.
- Write user guide and role-based manuals.
- Validate all endpoints with Postman collections.

---

### \U0001f517 5. Integration Agent
**Goal:** Implement and test Google API integration.
**Responsibilities:**
- Connect app with Google Classroom for assignment sync.
- Implement OAuth2 Google Login.
- Handle Gmail API for internal messaging.
- Write tests for auth/token handling and quota limits.

---

## \U0001f9e9 TASKS OVERVIEW (convertible into issues)

### \U0001f4c1 PHASE 1 \u2014 Core System (MVP)
- [ ] Design database schema (Users, Roles, Grades, Subjects, Attendance)
- [ ] Implement DRF models, serializers, and viewsets
- [ ] Create grade weighting and calculation module
- [ ] Set up authentication (JWT + Role-based)
- [ ] Build basic admin dashboard (React + MUI)
- [ ] Implement CRUD for students and teachers
- [ ] Set up attendance tracking
- [ ] Generate grade reports (PDF)
- [ ] Unit tests (pytest, coverage)

### \U0001f310 PHASE 2 \u2014 Integrations and Dashboards
- [ ] Connect with Google Classroom API
- [ ] Add Google OAuth2 login
- [ ] Sync assignments and grades
- [ ] Create analytics dashboard (React Charts)
- [ ] In-app messaging (simplified Gmail-style)
- [ ] Export data (CSV, PDF)

### \u2601\ufe0f PHASE 3 \u2014 Deployment and QA
- [ ] Dockerize frontend/backend
- [ ] AWS setup (EC2, RDS, S3)
- [ ] CI/CD with GitHub Actions
- [ ] Test production deployment
- [ ] Write final documentation

---

## \U0001f9ee AUTOMATION FORMAT (for issue generation)

> Example structure compatible with `githubcsvtools` or Markdown \u2192 CSV conversion

| Title | Description | Labels | Assignee |
|-------|--------------|---------|----------|
| `[Backend] Setup Django Models` | Create models for users, roles, subjects, grades, and attendance. | backend, database | backend-agent |
| `[Frontend] Dashboard UI` | Implement role-based dashboards in React using MUI. | frontend, ui | frontend-agent |
| `[DevOps] Dockerize App` | Create Dockerfiles for frontend and backend with multi-stage builds. | devops | devops-agent |
| `[Integration] Google Classroom Sync` | Implement Google Classroom API integration for assignment sync. | integration, google | integration-agent |
| `[QA] API Testing` | Validate all REST endpoints using Postman and pytest. | qa, testing | qa-agent |

---

## \u2699\ufe0f WORKFLOW AND COMMUNICATION RULES

1. Each agent works in its own branch (e.g., `agent/backend`, `agent/frontend`).  
2. Agents open pull requests with descriptive summaries and checklists.  
3. All agents report progress via `STATUS.md`.  
4. On PR merge, related issue(s) auto-close using \u201cCloses #X\u201d syntax.  
5. `main` branch always remains stable and deployable.  
6. Every task references documentation in `/docs/` and uses consistent naming conventions.

---

## \U0001f9ed VERSIONING & CONTINUITY

- Versioning follows **Semantic Versioning (SemVer)**.  
- For new features, agents must append changelog entries in `/CHANGELOG.md`.  
- Documentation must always reflect deployed version.  

---

## \U0001fa84 NEXT STEPS

1. Place this file as `AGENTS.md` at repo root.  
2. Create a `TASKS_CHECKLIST.md` (based on phases above).  
3. Use your script or `githubcsvtools` to convert checklist into issues.  
   Example:
   ```bash
   python githubcsvtools markdown_to_csv.py TASKS_CHECKLIST.md issues.csv
   githubcsvtools create-issues --repo mateo-bolanos/school-management --csv issues.csv