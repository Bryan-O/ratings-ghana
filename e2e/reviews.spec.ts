import { expect, test } from "@playwright/test";
import { login, registerAndVerifyEmail, uniqueEmail, uniquePhone, verifyPhone, waitForOutbox } from "./helpers";

test("search by name, location and type", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Business name").first().fill("Ike");
  await page.getByRole("button", { name: "Search" }).first().click();
  await expect(page).toHaveURL(/\/businesses\?q=Ike/);
  await expect(page.getByRole("heading", { name: "Ike's Cafe and Grill" })).toBeVisible();

  await page.goto("/businesses?location=Accra");
  await expect(page.getByRole("heading", { name: "Lancaster Hotel" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rakho Fufu" })).toHaveCount(0);

  await page.goto("/businesses");
  await page.getByRole("link", { name: "Online", exact: true }).click();
  await expect(page).toHaveURL(/type=ONLINE/);
  await expect(page.getByRole("heading", { name: "Jumia Ghana" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lancaster Hotel" })).toHaveCount(0);
});

test("register → verify email → verify phone → post a review", async ({ page }) => {
  const email = uniqueEmail("reviewer");
  const phone = uniquePhone();
  const title = `Best fufu in Kotei ${Date.now()}`;

  // Unverified email can't log in.
  await page.goto("/register?method=email");
  await page.getByLabel("Full name").fill("Kofi Boateng");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Sup3rSecret!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
  await page.goto("/login");
  await login(page, email, undefined, { expectSuccess: false });
  await expect(page.getByText("Please verify your email first.")).toBeVisible();

  const [, link] = await waitForOutbox(email, /(http\S+\/api\/verify-email\?token=\S+)/);
  const u = new URL(link);
  await page.goto(u.pathname + u.search);
  await expect(page.getByText("Email verified!")).toBeVisible();
  await login(page, email);
  await expect(page).toHaveURL("/");

  // Logged in but no phone → asked to verify before reviewing.
  await page.goto("/businesses/rakho-fufu");
  const before = Number(await page.getByText(/verified reviews?$/).textContent().then((t) => t!.split(" ")[0]));
  await page.getByRole("link", { name: "Verify phone number" }).first().click();
  await expect(page).toHaveURL(/\/verify-phone/);

  // Wrong code is rejected.
  await page.getByLabel("Ghana mobile number").fill(phone.national);
  await page.getByRole("button", { name: "Send code" }).click();
  const [, code] = await waitForOutbox(phone.e164, /code is (\d{6})/);
  await page.getByLabel(/Enter the 6-digit code/).fill(code === "000000" ? "111111" : "000000");
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(page.getByText(/That code is incorrect\. 4 attempts left/)).toBeVisible();
  await page.getByLabel(/Enter the 6-digit code/).fill(code);
  await page.getByRole("button", { name: "Verify" }).click();

  // Back on the business page with the review form.
  await expect(page).toHaveURL(/\/businesses\/rakho-fufu/);
  await expect(page.getByRole("heading", { name: "Give a review here" })).toBeVisible();

  // Validation: no stars.
  await page.getByRole("button", { name: "Post review" }).click();
  await expect(page.getByText("Choose a star rating")).toBeVisible();

  await page.getByLabel("5 stars — Excellent").check({ force: true });
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Your review").fill("Soft fufu, rich light soup and the goat meat was tender. Friendly service too.");
  await page.getByRole("button", { name: "Post review" }).click();
  await expect(page.getByText("Thanks! Your review is live.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  await expect(page.getByText(`${before + 1} verified reviews`)).toBeVisible();

  // Editing updates rather than duplicating.
  await expect(page.getByRole("heading", { name: "Your review" })).toBeVisible();
  await page.getByLabel("Title").fill(`Updated: ${title}`);
  await page.getByRole("button", { name: "Update review" }).click();
  await expect(page.getByText("Your review has been updated.")).toBeVisible();
  await page.reload();
  await expect(page.getByText(`${before + 1} verified reviews`)).toBeVisible();
  await expect(page.getByRole("heading", { name: `Updated: ${title}`, exact: true })).toBeVisible();

  // Changing the rating survives a failed submit (regression: React's form reset used to
  // snap the hidden radios back, silently re-submitting the old rating).
  await page.getByLabel("2 stars — Poor").check({ force: true });
  await page.getByRole("textbox", { name: "Your review" }).fill("Too short");
  await page.getByRole("button", { name: "Update review" }).click();
  await expect(page.getByText(/at least 30 characters/)).toBeVisible();
  await page.getByRole("textbox", { name: "Your review" }).fill("Service has slipped lately — we waited forty minutes and the soup was cold.");
  await page.getByRole("button", { name: "Update review" }).click();
  await expect(page.getByText("Your review has been updated.")).toBeVisible();
  await page.reload();
  const mine = page.locator("article").filter({ hasText: "(you)" });
  await expect(mine.getByRole("img", { name: "2 out of 5 stars" })).toBeVisible();
});

test("a phone number can only back one account", async ({ page, browser }) => {
  const phone = uniquePhone();

  const first = uniqueEmail("first");
  await registerAndVerifyEmail(page, first);
  await login(page, first);
  await page.goto("/verify-phone");
  await verifyPhone(page, phone);
  await expect(page).toHaveURL("/");

  const ctx = await browser.newContext();
  const page2 = await ctx.newPage();
  const second = uniqueEmail("second");
  await registerAndVerifyEmail(page2, second);
  await login(page2, second);
  await page2.goto("/verify-phone");
  await page2.getByLabel("Ghana mobile number").fill(phone.national);
  await page2.getByRole("button", { name: "Send code" }).click();
  await expect(page2.getByText("This number is already linked to another RatingsGhana account.")).toBeVisible();
  await ctx.close();
});

test("suggested businesses stay hidden until an admin approves them", async ({ page, browser }) => {
  const name = `E2E Waakye Joint ${Date.now()}`;
  const email = uniqueEmail("suggester");
  await registerAndVerifyEmail(page, email);
  await login(page, email);
  await page.goto("/verify-phone");
  await verifyPhone(page, uniquePhone());

  await page.goto("/businesses/new");
  await page.getByLabel("Business name").fill(name);
  await page.getByLabel("Category").selectOption("Restaurant");
  await page.getByLabel("Description").fill("Waakye with shito, gari, spaghetti and egg every morning.");
  await page.getByLabel("Address or landmark").fill("Near the Madina market");
  await page.getByLabel("Town / city").fill("Madina");
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("We'll review this business")).toBeVisible();

  await page.goto(`/businesses?q=${encodeURIComponent(name)}`);
  await expect(page.getByText("No businesses found.")).toBeVisible();

  // Non-admins can't see the admin page.
  const res = await page.goto("/admin");
  expect(res?.status()).toBe(404);

  const ctx = await browser.newContext();
  const admin = await ctx.newPage();
  await admin.goto("/login");
  await login(admin, "admin@ratingsghana.local", process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!");
  await admin.goto("/admin");
  const item = admin.getByRole("listitem").filter({ hasText: name });
  await item.getByRole("button", { name: "Approve" }).click();
  await expect(admin.getByRole("listitem").filter({ hasText: name })).toHaveCount(0);
  await ctx.close();

  await page.goto(`/businesses?q=${encodeURIComponent(name)}`);
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
});
