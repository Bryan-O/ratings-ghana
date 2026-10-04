import { expect, test, type Page } from "@playwright/test";
import { login, registerAndVerifyEmail, uniqueEmail, uniquePhone, verifyPhone } from "./helpers";

// A fresh, fully verified user per test (each user may only have 5 pending suggestions).
async function openForm(page: Page) {
  const email = uniqueEmail("suggest");
  await registerAndVerifyEmail(page, email);
  await login(page, email);
  await page.goto("/verify-phone");
  await verifyPhone(page, uniquePhone());
  await page.goto("/businesses/new");
}

async function fillOnlineBusiness(page: Page, name: string) {
  await page.getByLabel("Business name").fill(name);
  await page.getByText("Online only").click();
  await page.getByLabel("Description").fill("We sell modern sneakers and accessories");
  await page.getByLabel(/Website or social page/).fill("https://www.instagram.com/drezzupsneakers/?hl=en");
}

test("an online business with an Instagram page can be submitted", async ({ page }) => {
  await openForm(page);
  await fillOnlineBusiness(page, `Drezzup Sneakers ${Date.now()}`);

  // Category has no misleading default any more.
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("Choose a category")).toBeVisible();

  await page.getByLabel("Category").selectOption("Fashion");
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("Submitted. We're checking the details.")).toBeVisible();
});

test("fixing an error and resubmitting keeps the 'Online only' choice", async ({ page }) => {
  // Regression: after a failed submit React reset the form and the hidden radio snapped
  // back to "Physical location", so the resubmit failed on invisible address errors.
  await openForm(page);
  await page.getByLabel("Business name").fill(`Online Resubmit ${Date.now()}`);
  await page.getByText("Online only").click();
  await page.getByLabel("Category").selectOption("Fashion");
  await page.getByLabel("Description").fill("We sell modern sneakers and accessories");
  await page.getByLabel(/Website or social page/).fill("instagram.com/drezzupsneakers");
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText(/Enter a full URL/)).toBeVisible();

  await page.getByLabel(/Website or social page/).fill("https://www.instagram.com/drezzupsneakers/?hl=en");
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("Submitted. We're checking the details.")).toBeVisible();
});

test("a failed submit shows a message instead of doing nothing", async ({ page }) => {
  await openForm(page);
  const name = `Failing Submit ${Date.now()}`;
  await fillOnlineBusiness(page, name);
  await page.getByLabel("Category").selectOption("Fashion");

  await page.route("**/businesses/new", (route) =>
    route.request().method() === "POST" ? route.fulfill({ status: 500, body: "boom" }) : route.continue(),
  );
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("We couldn't send this")).toBeVisible();
  // What the user typed is still there.
  await expect(page.getByLabel("Business name")).toHaveValue(name);
});

test("a page from an older deployment asks the user to reload", async ({ page }) => {
  await openForm(page);
  await fillOnlineBusiness(page, `Stale Submit ${Date.now()}`);
  await page.getByLabel("Category").selectOption("Fashion");

  // Simulate the server no longer knowing this page's action (it was redeployed).
  await page.route("**/businesses/new", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({ status: 404, headers: { "x-nextjs-action-not-found": "1" }, body: "" })
      : route.continue(),
  );
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("This page is out of date")).toBeVisible();

  await page.unroute("**/businesses/new");
  await page.getByRole("button", { name: "Reload page" }).click();
  await expect(page.getByRole("button", { name: "Submit for review" })).toBeVisible();
});
