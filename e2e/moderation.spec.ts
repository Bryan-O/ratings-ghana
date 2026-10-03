import { expect, test, type Browser, type Page } from "@playwright/test";
import { login, registerAndVerifyEmail, uniqueEmail, uniquePhone, verifyPhone } from "./helpers";

async function verifiedUser(page: Page, name: string) {
  const email = uniqueEmail("mod");
  await registerAndVerifyEmail(page, email, name);
  await login(page, email);
  await page.goto("/verify-phone");
  await verifyPhone(page, uniquePhone());
  return email;
}

async function suggest(page: Page, b: { name: string; city: string; website?: string }) {
  await page.goto("/businesses/new");
  await page.getByLabel("Business name").fill(b.name);
  await page.getByLabel("Category").selectOption("Restaurant");
  await page.getByLabel("Description").fill("Fufu with light soup and goat meat, served all day.");
  await page.getByLabel("Address or landmark").fill("Near the main junction");
  await page.getByLabel("Town / city").fill(b.city);
  if (b.website) await page.getByLabel(/Website or social page/).fill(b.website);
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("Thanks! We'll review this business")).toBeVisible();
}

async function adminPage(browser: Browser) {
  const ctx = await browser.newContext();
  const admin = await ctx.newPage();
  await admin.goto("/login");
  await login(admin, "admin@ratingsghana.local", process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!");
  await admin.goto("/admin");
  return { admin, close: () => ctx.close() };
}

test("admin sees context, edits a pending listing, and approves it", async ({ page, browser }) => {
  const stamp = Date.now();
  await verifiedUser(page, "Yaw Asante");
  // Same identifying words as the seeded "Rakho Fufu" → should be flagged as a possible duplicate.
  const submitted = `Rakho Fufu Joint ${stamp}`;
  await suggest(page, { name: submitted, city: "Kotei", website: "https://www.instagram.com/rakhofufu/" });

  const { admin, close } = await adminPage(browser);
  const card = admin.locator("article").filter({ hasText: submitted });

  await expect(card.getByText(/Submitted just now|Submitted \d+ minute/)).toBeVisible();
  await expect(card.getByText("Yaw Asante")).toBeVisible();
  await expect(card.getByText("Phone verified")).toBeVisible();
  await expect(card.getByText(/0\s*approved · 0\s*rejected · 1\s*pending/)).toBeVisible();
  await expect(card.getByText(/Possible duplicate/)).toBeVisible();
  await expect(card.getByRole("link", { name: "Rakho Fufu", exact: true })).toBeVisible();

  const site = card.getByRole("link", { name: /instagram\.com\/rakhofufu/ });
  await expect(site).toHaveAttribute("href", "https://www.instagram.com/rakhofufu/");
  await expect(site).toHaveAttribute("target", "_blank");

  // Fix the name and category, then save & approve in one go.
  const fixed = `Mama Abena Chop Bar ${stamp}`;
  await card.getByText("Edit details before approving").click();
  await card.getByLabel("Business name").fill(fixed);
  await card.getByLabel("Category").selectOption("Fast Food");
  await card.getByRole("button", { name: "Save & approve" }).click();
  await expect(admin.locator("article").filter({ hasText: submitted })).toHaveCount(0);
  await close();

  await page.goto(`/businesses?q=${encodeURIComponent(fixed)}`);
  await expect(page.getByRole("heading", { name: fixed, exact: true })).toBeVisible();
  await page.goto("/my-submissions");
  await expect(page.getByRole("link", { name: fixed })).toBeVisible();
  await expect(page.getByText("Live", { exact: true })).toBeVisible();
});

test("a rejected suggestion shows the reason to the person who submitted it", async ({ page, browser }) => {
  const stamp = Date.now();
  await verifiedUser(page, "Efua Mensah");
  const name = `Ghost Kitchen ${stamp}`;
  await suggest(page, { name, city: "Tema" });
  await page.goto("/my-submissions");
  await expect(page.getByText("Awaiting review")).toBeVisible();

  const { admin, close } = await adminPage(browser);
  const card = admin.locator("article").filter({ hasText: name });
  await card.getByText("Reject…").click();
  await card.getByLabel(/Reason/).selectOption("We couldn't verify that this business exists");
  await card.getByLabel(/Note/).fill("No address or phone we could confirm.");
  await card.getByRole("button", { name: "Reject listing" }).click();
  await expect(admin.locator("article").filter({ hasText: name })).toHaveCount(0);
  await close();

  await page.goto("/my-submissions");
  await expect(page.getByText("Not approved")).toBeVisible();
  await expect(page.getByText("We couldn't verify that this business exists. No address or phone we could confirm.")).toBeVisible();
  // Still hidden from the public.
  await page.goto(`/businesses?q=${encodeURIComponent(name)}`);
  await expect(page.getByText("No businesses found.")).toBeVisible();
});
