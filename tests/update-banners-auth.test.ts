import { test, expect, vi } from "vitest";
import { updateCatalogueBanners } from "../src/app/admin/catalogues/actions"; // Adjust relative import path as needed

// Mock Next.js authentication module
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock Prisma client to prevent actual database calls during test execution
vi.mock("@/lib/prisma", () => ({
  getPrisma: () => ({
    catalogue: {
      update: vi.fn().mockResolvedValue({ slug: "sample-catalogue" }),
    },
  }),
}));

// Mock Next.js cache revalidation
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

test("updateCatalogueBanners should return authorization error when invoked by staff users", async () => {
  const { auth } = await import("@/auth");

  // Mock session representing a authenticated staff user without admin role
  vi.mocked(auth).mockResolvedValueOnce({
    user: {
      id: "user-staff-123",
      email: "staff@catalogue.test",
      role: "staff",
    },
    expires: new Date(Date.now() + 3600000).toISOString(),
  } as any);

  const sampleBanners = [
    {
      imageUrl: "https://example.com/banner.jpg",
      altText: "Seasonal Banner",
    },
  ];

  // Execute server action with a valid UUID
  const result = await updateCatalogueBanners(
    "123e4567-e89b-12d3-a456-426614174000",
    sampleBanners as any,
  );

  // Assertion expecting failure/forbidden response when role check is implemented
  expect(result).toEqual({ error: "Forbidden: Admin access required." });
});
