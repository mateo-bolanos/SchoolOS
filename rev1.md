# Rev 1 Frontend Plan — Scholar Theme

## 1. Current Audit Highlights
- The Vite-powered SPA mounts through `ReactDOM.createRoot` on the `#root` element and wraps routes in the shared theme provider, confirming that the project is architected as a client-side application. 
- The deployed experience is falling back to the unbuilt `frontend/index.html`, which still points at `/src/main.jsx`; when that happens the browser receives a 404 for the entry script, so React never hydrates and the page behaves like static HTML.
- The Docker and Vercel build paths already target the compiled `frontend/dist` bundle—CI/CD must ensure those artifacts are the ones published so the hashed `/assets/index-*.js` is delivered instead of the raw source file.
- Environment defaults resolve API calls to `http://localhost:8000/api`. Production must provide a hosted API URL through `VITE_API_URL` (and surface health checks) to avoid client errors once interactions are wired up.

## 2. Objectives for Rev 1
1. Deliver a scholarly, calm aesthetic (think tactile paper + modern typography) without cloning Notion.
2. Establish resilient layout primitives that scale from dashboards to detailed record views.
3. Define a content strategy and navigation model that align with SchoolOS roles (Admin, Teacher, Student, Parent).
4. Ship accessible, performant foundations: semantic markup, focus flows, contrast, animation restraint.
5. Instrument and document the frontend so future waves can layer richer data without rework.

## 3. Information Architecture
### Primary navigation (top-level)
| Section | Description | Key personas |
| --- | --- | --- |
| Overview | Cross-role announcements, alerts, and metrics snapshots. | All |
| Academics | Courses, assignments, grading rubrics, transcript access. | Admin, Teacher, Student |
| Operations | Attendance, scheduling, resource management, compliance reports. | Admin, Teacher |
| Community | Messaging, parent communication, extracurricular highlights. | Admin, Teacher, Parent |
| Profile & Settings | Personal data, preferences, notifications, integrations. | All |

### Secondary navigation patterns
- Contextual tabs within Academics (Classes, Assignments, Gradebook, Analytics).
- Left-rail quick filters (terms, cohorts, sections) with collapsible groups.
- Utility tray (top-right) for search, notifications, and account switching.

## 4. Experience Waves
1. **Wave 0 — Foundations**: implement global layout shell, typography scale, color tokens, responsive grid, baseline accessibility testing (axe smoke tests). Harden Vite build + deployment pipeline.
2. **Wave 1 — Overview & Academics MVP**: dashboards for Admin/Teacher, assignment list, attendance snapshot, announcement composer.
3. **Wave 2 — Communication & Community**: messaging hub, parent digest views, notification center.
4. **Wave 3 — Insights & Records**: analytics visualizations, transcript generation UI, export workflows.
5. **Wave 4 — Polish & Growth**: micro-interactions, customization, performance tuning, localization.

## 5. Design Tokens (Rev 1 draft)
- **Color palette**: 
  - Backgrounds: parchment (`#F7F4ED`), canvas (`#FFFFFF`), slate wash (`#F0F2F5`).
  - Text: charcoal (`#1F2933`), muted (`#52606D`), accent (`#0F766E`).
  - Accents: sage (`#9AA48F`), goldenrod (`#D9A441`), plum highlight (`#7C3E66`) used sparingly.
  - Semantic states: success `#2F855A`, warning `#C05621`, danger `#B83232`, info `#2B6CB0`.
- **Typography**: pairing of `"IBM Plex Serif", Georgia, serif` for headings and `"Inter", "Segoe UI", sans-serif` for body copy. Base size 16px, modular scale 1.25.
- **Spacing**: 4px baseline grid; standard ramps of 4, 8, 12, 16, 24, 32, 48, 64.
- **Elevation**: soft drop with layered shadows (`0 1px 2px rgba(15,23,42,0.08)` + `0 4px 10px rgba(15,23,42,0.04)`), plus inset divider lines for cards.
- **Shape**: 8px radii for cards and controls, 24px pill for chips.
- **Motion**: 180ms ease-out for interactive transitions, avoid parallax.

## 6. Routing Model & States
| Route | Purpose | Layout | Data needs |
| --- | --- | --- | --- |
| `/` | Personalized overview dashboard | AppLayout → OverviewGrid | Alerts, assignments, attendance summary |
| `/academics` | Course + assignment explorer | AppLayout → AcademicsLayout | Courses, grade weighting schema |
| `/academics/:courseId` | Course detail with tabs | AppLayout → CourseLayout | Assignments, roster, analytics |
| `/operations/attendance` | Attendance management | AppLayout → OperationsLayout | Attendance records, actions |
| `/community/messages` | Messaging center | AppLayout → TwoPaneLayout | Threads, recipients |
| `/profile` | Account management | NarrowLayout | User profile, notification settings |
| `/auth/*` | Auth flows (SSO, recovery) | AuthLayout | Auth endpoints |

Fallback routing: maintain a catch-all `*` route returning an error boundary with retry + support links.

## 7. Data & Integrations
- Centralize API calls through `services/api.js`; extend with typed client wrappers per domain (academics, attendance, messaging).
- Require `VITE_API_URL` in all deployment environments; add runtime health probe and graceful degradation messaging when unreachable.
- Prepare feature flags for integrations (Google Classroom, Gmail) to protect production from partially configured services.

## 8. Accessibility & Performance Budgets
- **Accessibility**: WCAG 2.2 AA, focus-visible styling, logical heading structure, ARIA landmarks. Axe score ≥ 95 on key flows. Color contrast ≥ 4.5:1 for text, 3:1 for UI components.
- **Performance**: Largest Contentful Paint ≤ 2.5s on 3G Fast, First Input Delay ≤ 100ms, CLS ≤ 0.1. Bundle budget ≤ 180KB gzip for initial route (code-split heavy views). Preload critical fonts, defer non-critical analytics.
- **Testing**: integrate automated accessibility checks (axe-vitest), Lighthouse CI smoke tests per wave, storybook visual regression (Chromatic or Loki) once components stabilize.

## 9. Content & Tone Guidelines
- Voice: encouraging, plain-language summaries with actionable next steps.
- Microcopy: use sentence case, avoid jargon; provide contextual tooltips for metrics.
- Empty states: include scholarly illustrations + checklists to guide first-time setup.

## 10. Deliverables & Tracking
- Update component library documentation with token references and usage guidelines.
- Maintain a living migration checklist for each wave (owners, dependencies, QA gates).
- Align design + engineering review cadence (weekly sync, async Loom walkthroughs for major updates).

