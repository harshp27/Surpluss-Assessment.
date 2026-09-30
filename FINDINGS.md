# Findings

One section per bug. Add or remove sections as needed — the headings are only a
starting point, not a form you have to fill in exactly.

---

# Security & Business Logic Audit Findings

## Bug 1: Missing Server-Side Role Check in `deleteCatalogue`

Bug Description: The `deleteCatalogue` server action checks whether an actor is authenticated, but fails to check whether the actor has the `admin` role.

Steps to Reproduce:
  1. Sign in as a `staff` account (`staff@catalogue.test`).
  2. Call `deleteCatalogue` directly with a valid catalogue ID.
  3. Observe that the catalogue is deleted without admin authorization.

Expected Behavior: Non-admin users (`staff`) should receive an authorization error (`Forbidden`), and the database record should remain untouched.

Severity & Business Impact: High — Staff users can bypass UI restrictions and permanently destroy production catalogue data and buyer enquiry histories.


## Bug 2: Missing Server-Side Role Check in `updateCatalogueBanners`

Bug Description: The `updateCatalogueBanners` action checks whether a user is logged in using `auth()`, but fails to verify if the user has the `admin` role before updating banner data.

Steps to Reproduce:
  1. Sign in as a `staff` user (`staff@catalogue.test`).
  2. Call `updateCatalogueBanners` with a valid catalogue ID and new banner payload.
  3. Observe that the banners update successfully without admin authorization.

Expected Behavior: Non-admin users (`staff`) should receive an authorization error (`Forbidden`), and the record should not update.

Severity & Business Impact: High — Allows unauthorized `staff` accounts to modify public branding assets on live catalogues.
-

## Bug 3: Public Access Leak on Draft Catalogues

Bug Description: `getPublishedCatalogue` fetches catalogue details by slug without checking whether `status` is set to `published`. As a result, confidential draft catalogues are publicly viewable.

Steps to Reproduce:
  1. Open a browser window without logging in.
  2. Navigate to `/catalogue/festive-overstock-2026` (a draft catalogue).
  3. Observe that the catalogue details and pricing are visible instead of returning a 404 error.

Expected Behavior:  Draft catalogues must be hidden from the public internet and return a 404 Not Found response.

Severity & Business Impact: Critical — Exposes internal draft pricing and unreleased inventory to non-authenticated public users.
-

---

## Bug 4: Stale Pricing & Enquiry Submission on Expired Catalogues

Bug Description: Expired catalogues (`expiresAt < now`) do not strictly restrict product price viewing or enquiry submission endpoints, allowing buyers to view outdated offer prices.

Steps to Reproduce:
  1. Navigate to `/catalogue/monsoon-clearance-2026` (an expired catalogue).
  2. Inspect the returned payload/page elements for pricing and item submission forms.
  3. Observe that stale pricing data is still accessible.

Expected Behavior: Expired catalogues must be closed, masking all pricing data and blocking new enquiry submissions.

Severity & Business Impact: High — Risk of selling items at outdated or non-viable historical price points.
-
