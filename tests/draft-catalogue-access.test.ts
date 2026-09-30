import { test, expect, vi } from "vitest";
import { getPublishedCatalogue } from "../src/lib/catalogue"; // adjust path if needed

vi.mock("@/lib/prisma", () => ({
  getPrisma: () => ({
    catalogue: {
      findFirst: vi.fn().mockResolvedValue({
        id: "cat-draft",
        slug: "festive-overstock-2026",
        status: "draft", // Draft state
        expiresAt: null,
      }),
    },
  }),
}));

test("getPublishedCatalogue should return null for draft catalogues", async () => {
  const result = await getPublishedCatalogue("festive-overstock-2026");

  // Must return null for draft catalogues to render a 404
  expect(result).toBeNull();
});
