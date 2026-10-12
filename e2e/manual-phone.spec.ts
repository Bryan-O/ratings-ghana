import { expect, test } from "@playwright/test";
import { login, registerAndVerifyEmail, uniqueEmail, uniquePhone } from "./helpers";

// Opt-in: needs a server running in manual phone mode, e.g.
//   SMS_PROVIDER=manual AUTH_URL=http://localhost:3100 npx next dev --port 3100
//   E2E_PHONE_MODE=manual npx playwright test e2e/manual-phone.spec.ts
test.skip(process.env.E2E_PHONE_MODE !== "manual", "manual phone mode only");

test("without SMS, an admin verifies a tester's phone before they can review", async ({ page, browser }) => {
  const email = uniqueEmail("manual-phone");
  const phone = uniquePhone();
  await registerAndVerifyEmail(page, email, "Kojo Boateng");
  await login(page, email);

  await page.goto("/verify-phone");
  await expect(page.getByText(/checks numbers by hand/)).toBeVisible();
  await page.getByLabel("Ghana mobile number").fill(phone.national);
  await page.getByRole("button", { name: "Send for verification" }).click();
  await expect(page.getByText(/Request sent for/)).toBeVisible();

  // Still blocked from reviewing until an admin verifies the number.
  await page.goto("/businesses/rakho-fufu");
  await expect(page.getByRole("link", { name: "Verify phone number" }).first()).toBeVisible();

  const ctx = await browser.newContext();
  const admin = await ctx.newPage();
  await admin.goto("/login");
  await login(admin, "admin@ratingsghana.local", process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!");
  await admin.goto("/admin");
  const row = admin.getByRole("listitem").filter({ hasText: email });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Verify" }).click();
  // The request leaves the queue once verified.
  await expect(row).toHaveCount(0);
  await ctx.close();

  await page.reload();
  await expect(page.getByRole("heading", { name: "How did it really go?" })).toBeVisible();
  await expect(page.getByLabel("5 stars — Excellent")).toBeAttached();
});
