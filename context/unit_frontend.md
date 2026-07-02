# Truvend Frontend — Implementation Units

This document breaks down the frontend visual overhaul into isolated units. The logic layer (auth, API calls, risk gating, checkout flow) already works. These units change how it looks, not how it works.

Design references: Odaplace marketplace (filter sidebar + product grid), Jumia (card density + layout). Truvend's brand tokens are already in `globals.css` — use them, don't override them.

Commit format: `feat(UF#.#): short description`

---

## Phase 0: Tooling

- [X] **Unit F0.1: Install shadcn/ui**
  - Run `npx shadcn@latest init` inside `/frontend`. Accept defaults, use the existing Tailwind setup.
  - Install these components only (don't install everything):
    ```
    npx shadcn@latest add dialog badge button card input separator
    ```
  - Confirm: `components/ui/` folder exists with generated files. App still builds with `npm run build`.


---

## Phase 1: Listing Card Redesign

- [x] **Unit F1.1: ListingCard with Product Image**
  - Rewrite `components/listings/ListingCard.tsx`.
  - Card structure (top to bottom):
    - Product image filling the top portion of the card (use `listing.photo_url`, fall back to a grey placeholder div with a package icon if null)
    - Risk badge positioned absolute top-right corner of the image area (small pill, not blocking the image)
    - Title (one line, truncate with ellipsis)
    - Price in bold, formatted as `₦150,000`
    - Seller name if available, muted text
  - Card styling: white background, subtle border, rounded-xl, hover shadow transition. Match the Odaplace card proportions — image takes roughly 60% of card height.
  - Use the shadcn `Card` primitive as the wrapper, `Badge` for the risk pill.
  - Verify: cards render with images from seed data. Cards without `photo_url` show the placeholder. Risk badge is visible on all four levels.

- [x] **Unit F1.2: ListingsGrid Responsive Layout**
  - Rewrite `components/listings/ListingsGrid.tsx`.
  - Grid: 4 columns on desktop (>1024px), 3 on tablet (>768px), 2 on mobile. Gap of 6.
  - Remove the `slice(0, 6)` from `app/page.tsx` — show all listings.
  - Verify: grid reflows correctly at all three breakpoints.

---

## Phase 2: Marketplace Browse Page

- [x] **Unit F2.1: Filter Sidebar**
  - Create `components/listings/FilterSidebar.tsx`.
  - Left sidebar (240px fixed width on desktop, collapsible on mobile).
  - Filter sections:
    - **Risk Level**: four checkboxes — Clear, Caution, Suspicious, High Risk. Filter the listing array client-side.
    - **Price Range**: two inputs (min/max) with a "Go" button. Filter client-side.
    - **Sort By**: dropdown — Newest, Price Low→High, Price High→Low, Risk Low→High.
  - Sidebar background: white, border-right, full viewport height minus navbar.
  - Verify: checking "High Risk" only shows high_risk listings. Price filter works. Sort changes card order.

- [x] **Unit F2.2: Browse Page Layout**
  - Rewrite `app/listings/page.tsx` (and update `app/page.tsx` to redirect or mirror it).
  - Layout: `FilterSidebar` on the left, `ListingsGrid` on the right filling remaining width.
  - Top of the grid area: result count text ("8 listings") and active filter pills (removable).
  - Search bar integrated at the top (reuse existing `SearchBar.tsx` or rebuild it into the top nav area).
  - Verify: page matches the Odaplace two-column layout. Filters apply instantly without page reload.

---

## Phase 3: Listing Detail Page

- [x] **Unit F3.1: Detail Page with Image and Risk Escalation**
  - Rewrite `app/listings/[id]/page.tsx`.
  - Layout (two columns on desktop, stacked on mobile):
    - Left column: large product image (or placeholder)
    - Right column: title, price, seller info, risk display, Buy Now button, AI analysis section
  - Risk display rules (these are already correct in the logic — this unit is about visual treatment):
    - `clear`: small green badge inline with the title. No disruption.
    - `caution`: yellow badge + a collapsible section showing `riskExplanation`. Default collapsed.
    - `suspicious`: orange banner above the price, always visible, showing `riskExplanation`. Cannot be dismissed.
    - `high_risk`: the existing `RiskModal` already works — no logic changes. Visually: make the modal use shadcn `Dialog` for accessibility (focus trap, escape key). Red overlay, large warning icon at top.
  - AI analysis section: card at the bottom showing risk score bar (0–100, colored by level) and explanation text.
  - Verify: all four risk states render correctly. The `high_risk` modal blocks checkout (already works, just confirm after visual changes).

---

## Phase 4: Navbar Redesign

- [x] **Unit F4.1: Top Navigation Bar**
  - Rewrite `components/layout/Navbar.tsx`.
  - Structure (left to right):
    - Logo/brand: "TRUVEND" in bold, white text on `teal-deep` background
    - Search input: centered, takes up middle space (rounded, white background, placeholder "Search products...")
    - Right side: Cart icon with count badge, user menu (login/signup if logged out, email + logout if logged in)
  - Navigation links (Listings, Buyer, Seller, Orders) move to a secondary row below the main bar, or into a hamburger menu on mobile.
  - Cart icon uses the `signal-orange` badge for item count.
  - Verify: navbar matches the Odaplace header pattern. Search input is functional. Responsive collapse works on mobile.

---

## Phase 5: Order Tracking & Seller Dashboard

- [x] **Unit F5.1: Order Status Timeline**
  - Rewrite `components/orders/EscrowTimeline.tsx`.
  - Vertical timeline component with dots and connecting lines.
  - Each status gets a step: pending → paid → in_escrow → dispatched → delivered → completed.
  - Current status: filled dot in `teal-mid`. Past statuses: filled dot in grey. Future: hollow dot, dashed line.
  - `disputed` and `cancelled` branch off the main line with a red dot and label.
  - Use on `app/orders/[id]/page.tsx`.
  - Verify: timeline renders correctly for each of the four seeded order statuses (completed, dispatched, paid, disputed).

- [x] **Unit F5.2: Seller Dashboard Table Layout**
  - Rewrite `app/seller/page.tsx`.
  - Stat cards row stays (Total Orders, Completed Sales, Revenue) — add icons and slightly more visual weight.
  - Virtual account section: card with bank name, account number (large, copyable), and account name.
  - Orders section: switch from stacked cards to a data table — columns: Order ID (truncated), Status (badge), Amount, Date, Action (dispatch button). Use shadcn `Card` for the table wrapper.
  - Payout history: similar table layout.
  - Verify: dispatch button works. Table is readable on desktop, stacks to cards on mobile.

---

## Phase 6: Auth Pages

- [x] **Unit F6.1: Login & Signup Styling**
  - Restyle `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx`.
  - Centered card layout (max-w-md, white card on grey background).
  - "TRUVEND" branding at top of card.
  - Form inputs use shadcn `Input` component.
  - Login: email + password + submit button. Link to signup.
  - Signup: display name + email + password + role selector (buyer/seller) + submit. Link to login.
  - Verify: both pages render cleanly. Auth flow still works end-to-end.

---

## Notes

- No logic changes in any unit. Auth, API calls, risk gating, checkout redirect, webhook polling — all of that already works. These units only change layout and styling.
- `photo_url` column was already added to the backend. Seed data includes Unsplash image URLs. If `listing.photo_url` is null, render a grey placeholder, never a broken image tag.
- The `high_risk` modal gate is the product's core safety feature. When migrating it to shadcn `Dialog`, confirm it still hard-blocks checkout. Do not add a way to close it that bypasses the three explicit choices (Report / Go Back / Proceed Anyway).
- All color tokens are already defined in `globals.css` under `@theme`. Use them via Tailwind classes (`bg-teal-deep`, `text-signal-orange`, etc.). Do not introduce new hex values.