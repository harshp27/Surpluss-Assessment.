import { test, expect } from "@playwright.test";

test.describe("Buyer Enquiry Journey", () => {
  test("should allow buyer to browse catalogue, submit enquiry, and verify in admin inbox", async ({
    page,
  }) => {
    // 1. Open published catalogue page
    await page.goto("/catalogue/summer-collection-2026");
    await expect(page.locator("h1")).toBeVisible();

    // 2. Browse and select a product
    const productCard = page.locator('[data-testid="product-card"]').first();
    await expect(productCard).toBeVisible();

    // 3. Add item to enquiry list
    const addToEnquiryBtn = productCard.locator("button", {
      hasText: /add to enquiry|enquire/i,
    });
    await addToEnquiryBtn.click();

    // 4. Open enquiry modal/drawer and fill out buyer details
    const enquiryDrawerBtn = page.locator("button", {
      hasText: /view enquiry|submit enquiry/i,
    });
    await enquiryDrawerBtn.click();

    await page.fill('input[name="name"]', "QA Test Buyer");
    await page.fill('input[name="email"]', "buyer@test.com");
    await page.fill('input[name="phone"]', "+919876543210");
    await page.fill('textarea[name="message"]', "Automated QA enquiry test.");

    // 5. Submit the enquiry
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Confirm submission success message
    await expect(page.locator("text=/enquiry sent|thank you/i")).toBeVisible();

    // 6. Navigate to Admin Leads Inbox to verify submission
    await page.goto("/admin/leads");

    // Confirm the submitted lead appears in the inbox list
    await expect(page.locator("text=QA Test Buyer")).toBeVisible();
    await expect(page.locator("text=buyer@test.com")).toBeVisible();
  });
});
