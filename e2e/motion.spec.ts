import { expect, test, type Page } from "@playwright/test";

async function heroState(page: Page) {
  return page.locator("[data-hero-word]").evaluateAll((els) =>
    els.map((el) => {
      const s = getComputedStyle(el);
      return { text: el.textContent, opacity: s.opacity, transform: s.transform };
    }),
  );
}

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the hero renders in its final state and nothing waits on an animation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Real people. Real opinions. No filters." })).toBeVisible();

    const words = await heroState(page);
    expect(words.map((w) => w.text)).toEqual(["Real", "people.", "Real", "opinions.", "No", "filters."]);
    for (const w of words) {
      expect(w.opacity).toBe("1");
      expect(w.transform).toBe("none");
    }

    // Motion never switches on, so no scroll-reveal item starts hidden.
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBeUndefined();
    const hidden = await page
      .locator("[data-reveal-group] > *")
      .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
    expect(hidden).toBe(0);
    await expect(page.getByText("See how shops, restaurants")).toHaveCSS("opacity", "1");
  });
});

test.describe("with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the hero builds itself and settles, and cards reveal on scroll", async ({ page }) => {
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe("on");

    // The headline keeps its size while animating (no layout shift).
    const h1 = page.getByRole("heading", { level: 1 });
    const before = await h1.boundingBox();
    await expect
      .poll(async () => (await heroState(page)).every((w) => w.opacity === "1" && w.transform === "none"), { timeout: 5000 })
      .toBe(true);
    expect(await h1.boundingBox()).toEqual(before);

    // Category tiles below the fold reveal once scrolled to.
    const tiles = page.getByRole("heading", { name: "Browse by category" }).locator("xpath=../..").locator("[data-reveal-group] > *");
    await tiles.first().scrollIntoViewIfNeeded();
    await expect(tiles.first()).toHaveAttribute("data-shown", "");
    await expect(tiles.first()).toHaveCSS("opacity", "1");
  });
});
