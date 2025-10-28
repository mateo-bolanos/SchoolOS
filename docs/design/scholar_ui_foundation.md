# Scholar UI Foundation

A modern, scholar-inspired interface baseline for SchoolOS. This document defines information architecture, shared design tokens, and component taxonomy to align teams and prevent rework.

## Information Architecture

### Global Navigation Principles
- Role-aware dashboard shortcuts surface current term insights first.
- Contextual breadcrumbs always start at the Dashboard and mirror the academic hierarchy (Term → Course → Section → Item).
- URL pattern uses kebab-case and stable identifiers to keep routes predictable and API-aligned.

### Page Map

| Page | URL Pattern | Primary Breadcrumb Trail | Key Content Zones |
| --- | --- | --- | --- |
| Dashboard | `/app/dashboard` | Dashboard | Hero metrics, announcement feed, upcoming items, quick actions |
| Courses & Sections | `/app/courses` | Dashboard › Courses | Course list by term, filters, section status chips |
| Course Detail | `/app/courses/:courseId` | Dashboard › Courses › {Course Name} | Overview, section tabs, syllabus summary |
| Section Workspace | `/app/courses/:courseId/sections/:sectionId` | Dashboard › Courses › {Course Name} › {Section Name} | People roster, schedule, resources, quick grading shortcuts |
| Gradebook | `/app/gradebook` | Dashboard › Gradebook | Multi-section table, term selector, performance summary |
| Gradebook Section View | `/app/gradebook/:sectionId` | Dashboard › Gradebook › {Section Name} | Assessment grid, grading status filters, bulk actions |
| Assignments | `/app/assignments` | Dashboard › Assignments | Assignment board, status filters, creation CTA |
| Assignment Detail | `/app/assignments/:assignmentId` | Dashboard › Assignments › {Assignment Title} | Summary, submissions, rubric, comments |
| Messaging Inbox | `/app/messaging` | Dashboard › Messaging | Message list, folders, quick compose |
| Conversation Thread | `/app/messaging/:threadId` | Dashboard › Messaging › {Thread Subject} | Message history, participants, attachments |

### Supporting Routes
- `/app/assignments/new` – Guided creation flow with autosave.
- `/app/messaging/compose` – Full-screen modal route for accessibility.
- `/app/settings/notifications` – Message and grade alerts preferences.

## Design Tokens

Import the canonical token file for implementation:

- [`docs/design/scholar_ui_tokens.json`](./scholar_ui_tokens.json)

Key guidance:
- Primary palette uses "ink" blues for academic gravitas; gold accent highlights achievements.
- Ensure 4.5:1 contrast minimum for text; pair `color.text.default` with `color.surface.base` by default.
- Focus rings layer `color.focusRing.outer` over `color.border.focus` and sit above elevation level 2.
- Motion tokens stay below 240 ms to maintain subtle interactions.

## Component Taxonomy & Usage Notes

### AppShell
Wraps authenticated experience with top navigation, collapsible side rail, and announcement bar. Uses `elevation.level1` for the header and maintains `spacing.lg` gutters.

### PageHeader
Sits at top of content area with title, metadata pills, and contextual actions. Supports breadcrumb injection and optional `Tabs` underneath. Minimum spacing: `spacing.lg` top/bottom.

### Tabs
For switching sibling views (e.g., Section tabs, Gradebook filters). Use underline indicator and focus ring. Motion duration: `motion.duration.swift`.

### Card
Surface-level containers for dashboard metrics and resource highlights. Default to `elevation.level1`; use `radius.md`. Include optional header and supporting text.

### List
Flexible vertical list with optional avatars, meta, and trailing actions (e.g., messaging threads). Maintain `spacing.md` between items; divide with `border.default`.

### Table
Dense data presentation (Gradebook, rosters). Use sticky header with `elevation.level1`. Row hover uses `color.surface.subtle`; focus outline wraps entire row.

### Toolbar
Horizontal control strip for filters, view toggles, and bulk actions. Position above Tables or Lists. Minimum height `spacing.3xl`; background `color.surface.muted`.

### Modal / Drawer
Use Modal for blocking flows (e.g., assignment creation) and Drawer for contextual edits (e.g., student quick view). Apply `radius.lg`, `elevation.level3`, and `motion.duration.standard`.

### Toast
Transient confirmations/errors anchored bottom-right on desktop, full-width on mobile. Maintain `spacing.md` padding and auto-dismiss after 5 s.

### Empty State
Illustrative card with iconography, headline, supportive copy, and primary CTA. Background `color.surface.subtle` with dashed border using `border.default`.

### Skeleton
For loading tables/cards. Use `color.surface.subtle` base and animated shimmer via `motion.duration.deliberate` with `easing.standard`.

### Additional Notes
- All interactive components require visible focus states using `color.focusRing.outer` overlay.
- Respect spacing scale for responsive layout: stack `spacing.xl` vertical rhythm on large screens, collapse to `spacing.lg` on mobile.
- Typography: use `typography.fontFamily.brand` for hero headings only; default to `typography.fontFamily.base` elsewhere.
