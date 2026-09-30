# QA Assessment Write-Up

## 1. Strategy

My testing strategy focused on high-risk business logic and access control boundaries. Because unauthorized data access, record deletion, and stale price exposure carry the highest financial and compliance risks, I prioritized server-side authorization enforcement over purely cosmetic UI tests.

For end-to-end automation, I chose a single critical buyer path:

Locators & Waiting: Used semantic role selectors, text regular expressions, and built-in Playwright auto-waiting assertions (`toBeVisible()`) rather than hardcoded `page.waitForTimeout()` delays to eliminate test flakiness.

Data Isolation: Used unique test buyer identities (`QA Test Buyer`) to ensure submission verification in the admin inbox remains predictable across runs.

---

## 2. Riskiest Part of the Product

The riskiest area of this application is Server-Side Authorization Enforcement within Server Actions and API Route Handlers.

If server actions (such as catalogue deletion or banner updates) rely solely on client-side UI visibility or simple `auth()` checks without strict role validation (`isAdmin`), malicious or authenticated non-admin users (`staff`) can bypass the frontend UI and execute unauthorized mutations directly. What goes wrong if untested: unauthorized users could alter public branding assets, delete live catalogues, or compromise lead histories.

---

## 3. What Was Left Out and Why

Exhaustive UI Component Layout & Visual Testing: Omitted to prioritize server action security and core business logic within the 4–6 hour target window.

Edge-Case Validation on Non-Critical Forms: Basic input masking and minor styling edge cases were left out because they carry low financial risk compared to broken auth guards or stale pricing leakage[cite: 1].

---

## 4. AI Usage

Tools Used: ChatGPT / Claude / Gemini

Application: Used for analyzing App Router server action patterns and generating initial Vitest assertion boilerplates[cite: 1].

Refinement: Every AI-assisted test was manually reviewed, updated to match project schema and role types (`admin` vs `staff`), and verified locally using `npm run test` to ensure assertions accurately catch underlying authorization bugs[cite: 1].

## 5. Codebase Quality & Recommended Improvement

Issue:Authorization checks are manually duplicated across individual server action handlers, leading to missing checks (e.g., missing role validation in `deleteCatalogue` and `updateCatalogueBanners`)[cite: 1].

Recommendation: Implement a centralized authorization wrapper (e.g., `withAdminAuth()`) or route middleware to enforce role checks systematically, preventing missing guard bugs when new server actions are added[cite: 1].
