import { test, expect, vi } from "vitest";
import { getPublishedCatalogue } from "../src/lib/catalogue"; // adjust path if needed

vi.mock("@/lib/prisma", () => ({
  getPrisma: () => ({
    catalogue: {
      findFirst: vi.fn().mockResolvedValue({
        id: "cat-expired",
        slug: "monsoon-clearance-2026",
        status: "published",
        expiresAt: new Date("2020-01-01"), // Expired date
        title: "Monsoon Clearance",
      }),
    },
  }),
}));

test("getPublishedCatalogue should return expired payload without products for expired catalogues", async () => {
  const result = await getPublishedCatalogue("monsoon-clearance-2026");

  // Must return expired object, hiding product and price listings
  expect(result).toHaveProperty("expired", true);
  expect(result).not.toHaveProperty("products");
});
