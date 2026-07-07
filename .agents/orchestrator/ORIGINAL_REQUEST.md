# Original User Request

## Initial Request — 2026-07-07T09:19:18+05:30

Please write your coordination files (plan.md, progress.md, context.md) to your own directory at `.agents/orchestrator/`. Decompose the work, spawn specialist agents (explorers, workers/implementers, reviewers) to do the technical work, and ensure that everything is thoroughly verified. Start by reading the project codebase, ORIGINAL_REQUEST.md, and PROJECT.md to build your plan.

AROH Ecosystem Platform Phase 2: Expand the platform foundation with session synchronization, a visual metrics engine, scheduled CMS alerts, and unified ecosystem search.

## Requirements

### R1. Aros Metrics Engine Dashboard
Build an observation panel displaying simulated live ecosystem charts (such as CPU load, memory usage, transaction volumes, and user journeys) using the pre-installed `recharts` library.

### R2. Ecosystem-Wide Search
Implement an interactive, instant search input in the Explore Hub and the Command Palette that searches across CMS announcements, registered products, and documentation.

### R3. Scheduled CMS Alerts
Enable operators to configure a publication date/time for announcements. Announcements must remain hidden on the homepage until the scheduled publication time.

### R4. Local SSO Session Sync
Synchronize the authentication state across multiple browser tabs using local storage events. Signing out in one tab must immediately sign out all other active tabs.

## Acceptance Criteria

### Metrics Engine
- [ ] Renders at least 3 distinct charts (e.g. Line, Area, or Bar charts) using `recharts` on the administrative metrics panel.
- [ ] Metrics data is dynamically simulated or fetched.

### Search and Navigation
- [ ] Command palette filters and displays results from products, documentation, and live announcements.
- [ ] Explore page search filters products by keyword matching in name or description.

### Scheduled Alerts
- [ ] CMS form accepts a scheduled publication date/time input.
- [ ] Announcements with a future publication date do not render on the homepage hub list.

### Session Sync
- [ ] Opening two tabs on the app, logging out in one triggers automatic logout/redirect to `/login` in the other.
