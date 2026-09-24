import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  const essential = page.getByRole("button", { name: "Essential only" });
  if (await essential.isVisible()) await essential.click();
});

test("landing, assessment, defender result, and share link", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "A smarter way to understand how you work with people." })).toBeVisible();
  await page.getByRole("link", { name: "Take the F5 Test" }).first().click();
  await expect(page.getByText("There are no right answers")).toBeVisible();
  await page.getByRole("button", { name: "Start" }).click();

  for (let step = 0; step < 22; step += 1) {
    await page.locator("[data-pole='a']").click();
  }
  await page.waitForURL("**/results");
  await expect(page.getByRole("heading", { name: "You're a Defender" })).toBeVisible();
  await expect(page.getByText("Deep and thoughtful")).toBeVisible();
  await expect(page.getByText("It's not about you. It's about them.")).toBeVisible();
  await expect(page.getByText("Control process")).toBeVisible();

  const overflow = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  expect(overflow.width).toBeLessThanOrEqual(1);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((item) => item.impact === "critical")).toEqual([]);
});

test("invalid share codes return home and a valid code shows the type", async ({ page }) => {
  await page.goto("/r/NOT-A-CODE");
  await expect(page).toHaveURL(/notice=link/);
  await expect(page.getByText("doesn’t look right")).toBeVisible();

  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/r/DE-0-0");
  const cta = page.getByRole("link", { name: "Take the test yourself" });
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  expect(box?.y ?? 999).toBeLessThan(667);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Defender");
  const title = await page.locator('meta[property="og:title"]').getAttribute("content");
  expect(title).toContain("Defender");
});

test("email capture requires consent", async ({ page }) => {
  await page.goto("/#early-access");
  const form = page.locator("#early-access form");
  await form.getByRole("textbox", { name: "Email", exact: true }).fill("not-an-email");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Get early access" }).click();
  await expect(form.getByText("Enter a valid email address.")).toBeVisible();
  await form.getByRole("checkbox").uncheck();
  await expect(form.getByRole("button", { name: "Get early access" })).toBeDisabled();
  await form.getByRole("textbox", { name: "Email", exact: true }).fill("ada@example.com");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Get early access" }).click();
  await expect(page.getByText("You’re on the list")).toBeVisible();
});

test("playbook teammate to defender has two tips", async ({ page }) => {
  await page.goto("/playbook?you=teammate&other=defender");
  const list = page.getByRole("list", { name: "Adjustment tips" }).first();
  await expect(list.getByRole("listitem")).toHaveCount(2);
  await expect(list).toContainText("Less personal");
  await expect(list).toContainText("Factual and detail oriented");
});
