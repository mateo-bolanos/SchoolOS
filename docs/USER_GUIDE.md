# SchoolOS User Guide

## Product status
SchoolOS is currently in an early planning phase: the Django backend skeleton is present, while the web frontend and user-facing workflows have not yet been implemented. This guide outlines the intended behaviour for each role so that early adopters understand the roadmap and can validate requirements as features arrive.

## Platform roles
- **Administrator** – Oversees tenant configuration, manages schools, and controls onboarding.
- **Teacher** – Manages class rosters, assignments, and communicates progress to students and guardians.
- **Student** – Reviews assignments, grades, and announcements related to their enrolled sections.
- **Parent/Guardian** – Monitors student progress, receives communications, and acknowledges alerts.

## Planned capabilities
| Role | Upcoming capabilities |
| --- | --- |
| Administrator | Tenant and school configuration, role assignment, reporting dashboards, and managing grading policies. |
| Teacher | Course setup, assignment creation, gradebook management, messaging with students/guardians, and report generation. |
| Student | Viewing enrolled courses, assignment details, current grades, and receiving announcements. |
| Parent/Guardian | Viewing linked student grades, attendance summaries (future), and receiving communications. |

## Getting started checklist
Until the frontend is available, administrators can prepare by:
1. Setting up the backend following `docs/BACKEND_SETUP.md` and recording environment variables for later reuse.
2. Enumerating required roles, schools, and grading policies so they can be created quickly once models are ready.
3. Coordinating with the development team on integration priorities (Google Classroom, messaging, reporting).

## Feedback loop
- Capture feedback about documentation, terminology, and onboarding in shared project channels.
- Update this guide whenever new UI components, API endpoints, or workflows are merged into the repository.
