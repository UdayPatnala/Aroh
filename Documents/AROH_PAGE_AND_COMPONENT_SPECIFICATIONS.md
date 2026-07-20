# AROH Page & Component Formal Specifications

- **Specification Version:** v2.0.0
- **Status:** Active Standard
- **Scope:** Ecosystem Web Application (`apps/web`)
- **Author:** AROH Platform Engineering Group

---

## 1. Page Specifications Registry

### 1.1. Introduction / Landing Page (`/`)
- **Purpose:** Primary introduction to the AROH AI-native ecosystem. Showcases unified identity, Aros token economy, and flagship products.
- **Audience:** Visitors, developers, enterprise teams.
- **Key Sections:** Hero header with mesh background, Ecosystem Stats, Product Carousel (Nebula, Spedex, Music Mirror, JavaPath Pro), Live CMS Announcements, Global Command Palette trigger.
- **SEO & Accessibility:** Single `<h1>`, metadata title "AROH — AI-Native Digital Product Ecosystem", keyboard navigable.

### 1.2. Authentication Portal (`/login`)
- **Purpose:** Secure login, SSO session synchronization, and identity verification.
- **Hydration Guard:** Renders mock credential quick-fill panel strictly client-side after mounting to prevent Next.js hydration mismatch #418.
- **Security:** Authenticates via Firebase ID Tokens; token verification occurs in API routes (`app/api/auth/session/route.ts`).

### 1.3. Home Dashboard (`/dashboard`)
- **Purpose:** Centralized user overview displaying wallet balance, membership level, quick actions, active workspace status, and real-time alerts.
- **Components:** Wallet Card, Notification Stream, Quick Product Launcher, Activity Timeline.

### 1.4. Products Directory & Explore Hub (`/explore`)
- **Purpose:** Discoverable registry of all ecosystem applications and product core integrations.
- **Features:** Category filtering, search index, product launcher cards, third-party developer integration documentation links.

### 1.5. Developer AI Workspace (`/ai`)
- **Purpose:** AI prompt engineering portal and workspace assistant.
- **Backend:** Connected to `@aroh/asdk` `AIOrchestrator` for provider-agnostic completion and context analysis.

### 1.6. CMS Announcement Portal (`/cms`)
- **Purpose:** Content management panel for publishing category-based announcements (`info`, `promotion`, `maintenance`) with scheduled publishing filters.

### 1.7. Administration & Metrics Panel (`/admin`)
- **Purpose:** Platform telemetry dashboard rendering real-time system performance graphs, wallet transaction logs, and user role management.

---

## 2. Component Composition Standards

Every UI component in `apps/web` or `@aroh/ads` must satisfy:
1. **Token Integration:** Styles derived exclusively from `@aroh/ads/tokens`.
2. **Keyboard Accessibility:** Explicit focus rings, `Tab` order compliance, `Enter`/`Space` activation for buttons.
3. **Responsive Behaviors:** Dynamic container bounds calculation without hardcoded arbitrary pixel offsets.
4. **Hydration Integrity:** Client-side guarded mounting for state accessing `localStorage` or dynamic timestamps.
