import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("a logged-out tester sends feedback and the admin can review, resolve and export it", async ({ page, browser }) => {
  const message = `The photo upload spinner never stopped ${Date.now()}`;

  await page.goto("/businesses/rakho-fufu");
  await page.getByRole("button", { name: "Feedback" }).click();
  const dialog = page.getByRole("dialog", { name: "Send feedback" });
  await expect(dialog).toBeVisible();

  // Validation: needs a type and a message.
  await dialog.getByRole("button", { name: "Send feedback" }).click();
  await expect(dialog.getByText("Choose what kind of feedback this is")).toBeVisible();

  await dialog.getByText("Something's broken").click();
  await dialog.getByLabel("Your message").fill(message);
  await dialog.getByLabel(/Email/).fill("tester@example.com");
  await dialog.getByRole("button", { name: "Send feedback" }).click();
  await expect(dialog.getByText("Thanks — your feedback was sent.")).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).last().click();
  await expect(dialog).toBeHidden();

  // Non-admins can't see feedback.
  expect((await page.goto("/admin/feedback"))?.status()).toBe(404);
  expect((await page.request.get("/admin/feedback/export")).status()).toBe(404);

  // Admin view.
  const ctx = await browser.newContext({ acceptDownloads: true });
  const admin = await ctx.newPage();
  await admin.goto("/login");
  await login(admin, "admin@ratingsghana.local", process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!");
  await admin.goto("/admin");
  await expect(admin.getByRole("link", { name: /Tester feedback/ })).toContainText(/\d+ new/);
  await admin.getByRole("link", { name: /Tester feedback/ }).click();

  const item = admin.locator("article").filter({ hasText: message });
  await expect(item).toContainText("Bug");
  await expect(item.getByRole("link", { name: "/businesses/rakho-fufu" })).toBeVisible();
  await expect(item).toContainText("tester@example.com");
  await expect(item).toContainText(/Chrome on (Windows|Linux|macOS)/);

  // CSV export contains it.
  const [download] = await Promise.all([admin.waitForEvent("download"), admin.getByRole("link", { name: "Download CSV" }).click()]);
  const csv = readFileSync((await download.path())!, "utf8");
  expect(csv).toContain(message);
  expect(csv).toContain("tester@example.com");

  // Resolve → moves to the Resolved tab.
  await item.getByRole("button", { name: "Mark resolved" }).click();
  await expect(admin.locator("article").filter({ hasText: message })).toHaveCount(0);
  await admin.getByRole("link", { name: /^Resolved/ }).click();
  await expect(admin.locator("article").filter({ hasText: message })).toContainText("Resolved");
  await ctx.close();
});
