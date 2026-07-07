# Original User Request

## Initial Request — 2026-07-06T16:47:42+05:30

The goal of this project is to audit the completed AROH Phase 1 codebase, verify its git history and file states, and validate deployment configurations for Vercel and Firebase.

Working directory: d:\PROJECT\AROH
Integrity mode: development

## Requirements

### R1. Git Status & History Audit
Audit the git repository state to identify modified, untracked, or conflict files, and verify recent commit logs for style and completeness.

### R2. Vercel Configuration & CLI Verification
Verify local Vercel configuration files (vercel.json if any, Next.js build configuration), check package dependencies, and inspect active Vercel connection status if CLI credentials are found.

### R3. Firebase Settings & Security Rules Audit
Verify database connections, validate firestore.rules for role escalation blocks and read/write security gates, and check the firebase configuration files.

## Acceptance Criteria

### Git Integrity
- [ ] List all uncommitted modified or untracked files in the workspace.
- [ ] Verify there are no merge conflicts or broken head states.

### Vercel Readiness
- [ ] Confirm next.config matches production build specifications.
- [ ] Verify that package dependencies in apps/web/package.json are fully locked and resolved.
- [ ] Check Vercel command line interface connection status.

### Firebase Readiness
- [ ] Confirm Firestore security rules strictly block direct client writes to /wallets and /transactions.
- [ ] Verify that firebase.json and firebase configuration structures are correct.

## Follow-up — 2026-07-07T03:48:56Z

AROH Ecosystem Platform Phase 2: Expand the platform foundation with session synchronization, a visual metrics engine, scheduled CMS alerts, and unified ecosystem search.

Working directory: d:\PROJECT\AROH
Integrity mode: development

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
