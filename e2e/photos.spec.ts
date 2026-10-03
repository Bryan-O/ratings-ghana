import sharp from "sharp";
import { expect, test } from "@playwright/test";
import { login, registerAndVerifyEmail, uniqueEmail, uniquePhone, verifyPhone } from "./helpers";

async function testPhoto(color: { r: number; g: number; b: number }) {
  return sharp({ create: { width: 1200, height: 900, channels: 3, background: color } }).jpeg().toBuffer();
}

test("verified users upload photos that appear only after admin approval", async ({ page, browser }) => {
  const slug = "tonaton";
  const caption = `Office front ${Date.now()}`;

  // Logged-out visitors are asked to log in instead of seeing the uploader.
  await page.goto(`/businesses/${slug}`);
  await expect(page.getByRole("link", { name: "Log in to add photos" })).toBeVisible();
  await expect(page.getByLabel("Choose photos")).toHaveCount(0);

  const email = uniqueEmail("photographer");
  await registerAndVerifyEmail(page, email, "Abena Owusu");
  await login(page, email);
  await page.goto("/verify-phone");
  await verifyPhone(page, uniquePhone());

  await page.goto(`/businesses/${slug}#add-photos`);
  const before = await page.getByText(/^\d+ photos? ·|No photos yet/).first().textContent();

  await page.getByLabel("Choose photos").setInputFiles([
    { name: "front.jpg", mimeType: "image/jpeg", buffer: await testPhoto({ r: 20, g: 120, b: 60 }) },
  ]);
  await page.getByLabel(/Caption/).fill(caption);

  // Rights confirmation is required.
  await page.getByRole("button", { name: "Upload 1 photo" }).click();
  await expect(page.getByText("Please confirm you took these photos")).toBeVisible();

  await page.getByLabel(/I took these photos myself/).check();
  await page.getByRole("button", { name: "Upload 1 photo" }).click();
  await expect(page.getByText("Sent for review")).toBeVisible();
  await expect(page.getByText(/You have 1 photo awaiting review/)).toBeVisible();

  // Not public yet.
  await page.goto(`/businesses/${slug}/photos`);
  await expect(page.getByText(caption)).toHaveCount(0);
  expect(await page.goto(`/businesses/${slug}`).then(() => page.getByText(/^\d+ photos? ·|No photos yet/).first().textContent())).toBe(before);

  // Admin approves it.
  const ctx = await browser.newContext();
  const admin = await ctx.newPage();
  await admin.goto("/login");
  await login(admin, "admin@ratingsghana.local", process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!");
  await admin.goto("/admin");
  const item = admin.getByRole("listitem").filter({ hasText: caption });
  await expect(item).toContainText("Abena");
  await item.getByRole("button", { name: "Approve", exact: true }).click();
  await expect(admin.getByRole("listitem").filter({ hasText: caption })).toHaveCount(0);

  // Now visible with credit, and used as the business cover photo.
  await page.goto(`/businesses/${slug}/photos`);
  await expect(page.getByText(caption)).toBeVisible();
  await expect(page.getByText("Photo by Abena").first()).toBeVisible();
  const img = page.getByRole("img", { name: caption });
  await img.scrollIntoViewIfNeeded();
  // The processed WebP actually loads (through the Next image optimizer).
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth), { timeout: 15_000 }).toBeGreaterThan(0);

  // It is also the cover image on the business card.
  await page.goto("/businesses?q=Tonaton");
  const cover = page.getByRole("link", { name: /Tonaton/ }).first().locator("img").first();
  await expect(cover).toHaveAttribute("src", /uploads/);

  // Admin can take it down again.
  await admin.goto(`/businesses/${slug}/photos`);
  await admin.getByRole("listitem").filter({ hasText: caption }).getByRole("button", { name: "Remove" }).click();
  await expect(admin.getByText(caption)).toHaveCount(0);
  await ctx.close();
});
