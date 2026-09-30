import { test, expect, vi } from "vitest";
import { deleteCatalogue } from "../src/app/admin/catalogues/actions"; // adjust import path if needed
import * as authGuards from "../src/auth-guards";

vi.mock("@/lib/prisma", () => ({
  getPrisma: () => ({
    catalogue: {
      delete: vi
        .fn()
        .mockResolvedValue({ slug: "test", name: "Test Catalogue" }),
    },
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

test("deleteCatalogue should prevent non-admin staff users from deleting catalogues", async () => {
  // Mock current actor as staff (not admin)
  vi.spyOn(authGuards, "currentActor").mockResolvedValue({
    id: "user-1",
    email: "staff@catalogue.test",
    role: "staff",
  } as any);

  const result = await deleteCatalogue("123e4567-e89b-12d3-a456-426614174000");

  // Should reject staff, but currently succeeds or returns ok
  expect(result).toEqual({ error: "Forbidden: Admin access required." });
});
