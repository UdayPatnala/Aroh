# AROH Phase 1 Completion Roadmap & Next Steps

This document outlines the remaining features required to complete the Phase 1 MVP milestones for the AROH Ecosystem Platform.

---

## 📋 Outstanding Tasks

### 1. 👤 User Settings & Profile Customization
* **Objective:** Enable users to edit their profiles, change appearance themes, and configure notification preferences.
* **Deliverables:**
  * Implement Profile settings inputs (Display Name, Avatar URL).
  * Implement Appearance theme switcher (Sleek Dark Mode, Modern Gray, Cyber Gold).
  * Implement Notification Preference toggles (In-App, Email alerts).
  * Integrate changes into a new "Settings" panel inside `/dashboard`.

### 2. 🛍️ Product Registry & Explore Hub (`/explore`)
* **Objective:** Create a searchable index, category browse interface, and detailed documentation pages for all ecosystem products.
* **Deliverables:**
  * Create `/explore/page.tsx` to host the Product Explorer showing categories, search queries, and filters.
  * Create `/explore/[productId]/page.tsx` to render rich metadata details for each product (e.g., active version, developer, cost, required membership tier).
  * Register additional mock products (e.g., "Aroh Notification Center", "Aros Command Console", "AROH AI Doc Helper").

### 3. 🤖 AROH AI Portal (`/ai`)
* **Objective:** Introduce the developer-facing AI hub featuring prompt engineering standards and a documentation assistant shell.
* **Deliverables:**
  * Create `/ai/page.tsx` presenting the AROH AI interface.
  * Show prompt examples (Code Reviewer Prompt, Accessibility Prompt, Security Audit Prompt).
  * Implement a Mock "Documentation Helper" query bar to search documentation templates.

### 4. 🔔 In-App Notifications
* **Objective:** Deliver real-time notifications for ledger events, upgrades, and CMS alerts.
* **Deliverables:**
  * Add a `notifications` array and notification helper actions to the global Zustand store state.
  * Implement a dropdown notifications center (bell icon) in the header of all pages.
  * Trigger notifications when:
    * A membership upgrade is processed.
    * A wallet balance is credited.
    * A new CMS announcement is published.

### 5. ⌨️ Global Command Palette
* **Objective:** Introduce a keyboard-driven command palette (Triggered by `Ctrl+K` or `Cmd+K`) to jump between pages and search registered products.
* **Deliverables:**
  * Build a floating command palette component (`CommandPalette`) with search filtering.
  * Allow quick actions: "/home", "/dashboard", "/explore", "/admin", "/cms", "/ai", "/logout".

---

## 🛠️ Implementation Plan

1. **Phase 1.1: State Extensions**
   * Extend the Zustand store (`packages/asdk/src/store/index.ts`) to manage:
     * User notification preferences and profiles state.
     * Real-time in-app notifications queue.
     * Active appearance themes.
2. **Phase 1.2: Explorer & Detail Routes**
   * Build `/explore` page layouts, categories grid, search functionality, and `/explore/[productId]` detail pages.
3. **Phase 1.3: AI Portal & Prompt Library**
   * Construct `/ai` page with clean, copyable prompt templates and a mock doc search dashboard.
4. **Phase 1.4: Notification & Command Interface UI**
   * Embed the global floating `CommandPalette` search panel and header `NotificationCenter` drop-down menu in the base layouts.
5. **Phase 1.5: Settings Panel Integration**
   * Refactor `/dashboard` to host tabs for Wallet Overview, Membership Tiers, and Account Settings (profile updates, notification toggles, theme adjustments).
