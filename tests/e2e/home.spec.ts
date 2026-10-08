import { test, expect } from "@playwright/test";

test.describe("BazarDor public routes", () => {
  test("home page renders the required sections and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "আজকের বাজারের দাম এক নজরে" })).toBeVisible();
    await expect(page.getByRole("link", { name: "সব পণ্য দেখুন" })).toHaveAttribute("href", "#সব-পণ্য");
    await expect(page.locator("#সব-পণ্য")).toBeVisible();
    await expect(page.getByRole("heading", { name: "আজ দাম বেড়েছে" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "আজ দাম কমেছে" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "সব পণ্য" })).toBeVisible();
  });

  test("navbar exposes authentication and category navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "সাইন ইন" })).toBeVisible();
    await expect(page.getByRole("link", { name: "সাইন আপ" })).toBeVisible();
    const categoryLinks = page.locator('nav[aria-label="পণ্যের বিভাগ"] a');
    await expect(categoryLinks.first()).toBeVisible();
    await expect(categoryLinks.first()).toHaveAttribute("href", /\/category\//);
  });

  test("sign in page renders", async ({ page }) => {
    await page.goto("/signin");
    await expect(page.getByRole("heading", { name: "সাইন ইন" })).toBeVisible();
    await expect(page.getByLabel("ইমেইল")).toBeVisible();
    await expect(page.getByLabel("পাসওয়ার্ড")).toBeVisible();
  });

  test("sign up page renders all fields", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: "অ্যাকাউন্ট তৈরি করুন" })).toBeVisible();
    await expect(page.getByLabel("নাম")).toBeVisible();
    await expect(page.getByLabel("ইমেইল")).toBeVisible();
    await expect(page.getByLabel("পাসওয়ার্ড", { exact: true })).toBeVisible();
    await expect(page.getByLabel("পাসওয়ার্ড নিশ্চিত করুন")).toBeVisible();
  });

  test("sign in validation rejects invalid input", async ({ page }) => {
    await page.goto("/signin");
    await page.getByLabel("ইমেইল").fill("invalid");
    await page.getByLabel("পাসওয়ার্ড").fill("short");
    await page.getByRole("button", { name: "সাইন ইন" }).click();
    await expect(page.getByText("সঠিক ইমেইল দিন।")).toBeVisible();
  });

  test("sign up validation rejects mismatched passwords", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("নাম").fill("পরীক্ষা ব্যবহারকারী");
    await page.getByLabel("ইমেইল").fill("test@example.com");
    await page.getByLabel("পাসওয়ার্ড", { exact: true }).fill("password123");
    await page.getByLabel("পাসওয়ার্ড নিশ্চিত করুন").fill("password456");
    await page.getByRole("button", { name: "অ্যাকাউন্ট তৈরি করুন" }).click();
    await expect(page.getByText("পাসওয়ার্ড মিলছে না।")).toBeVisible();
  });

  test("unknown route is a real 404", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "পৃষ্ঠা পাওয়া যায়নি" })).toBeVisible();
  });

  test("category route supports direct navigation and refresh", async ({ page }) => {
    await page.goto("/");
    const categoryHref = await page.locator('nav[aria-label="পণ্যের বিভাগ"] a').first().getAttribute("href");
    expect(categoryHref).toBeTruthy();
    await page.goto(categoryHref!);
    await expect(page.locator("main")).toBeVisible();
    await page.reload();
    await expect(page.locator("main")).toBeVisible();
  });

  test("protected profile and product routes redirect unauthenticated users", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Fprofile/);

    await page.goto("/profile/update");
    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Fprofile%2Fupdate/);

    await page.goto("/product/1");
    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Fproduct%2F1/);
  });

  test("product cards point to API identifiers", async ({ page }) => {
    await page.goto("/");
    const card = page.locator('a[href^="/product/"]').first();
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("href", /\/product\/[^/]+/);
  });

  test("responsive pages do not create horizontal page overflow", async ({ page }) => {
    for (const width of [320, 375, 425, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
    }
  });

  test("no major browser console errors occur on the home page", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("/");
    await page.waitForTimeout(1000);
    expect(errors).toEqual([]);
  });
});
