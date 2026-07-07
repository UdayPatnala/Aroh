# Scope: M3 - Ecosystem-Wide Search (R2)

## Architecture
- Explore Hub Page: `apps/web/app/explore/page.tsx`
- Command Palette: `apps/web/app/components/command-palette.tsx`
- AI Doc Database: `apps/web/app/ai/page.tsx`
- Announcements: fetched via `usePlatformStore` in the Command Palette

## Requirements
- Command palette filters and displays results from products, documentation, and live announcements.
- Search input is interactive and instantly filters results.
- Explore page search filters products by keyword matching in name or description.

## Interface Contracts
- In `apps/web/app/ai/page.tsx`:
  - Export `mockDocDatabase` so it can be imported by the Command Palette.
- In `apps/web/app/components/command-palette.tsx`:
  - Import `registeredProducts` from `apps/web/app/explore/page.tsx` and `mockDocDatabase` from `apps/web/app/ai/page.tsx`.
  - Fetch live announcements using `usePlatformStore` (call `fetchAnnouncements` in a `useEffect` when the palette is opened).
  - Combine products, documentation, and announcements into the Command Palette's searchable items list.
  - Filter items matching name/title, category, and description/content (e.g. documentation content, product description, announcement content).
  - Ensure the action for selecting a product/doc/announcement correctly navigates the user and closes the palette.
