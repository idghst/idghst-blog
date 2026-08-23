import { test, expect } from "@playwright/test";

test("admin login form is visible", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "글 작성" })).toBeVisible();
  await expect(page.getByLabel("관리자 키")).toBeVisible();
  await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
});

test("admin rejects a bad key", async ({ page }) => {
  await page.route("**/api/admin/session", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ ok: false }),
      });
      return;
    }
    await route.continue();
  });
  await page.goto("/admin");
  await page.getByLabel("관리자 키").fill("wrong-key");
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByText("관리자 키가 올바르지 않습니다.")).toBeVisible();
});

test("admin editor appears after login mock", async ({ page }) => {
  await page.route("**/api/admin/session", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
      return;
    }
    await route.continue();
  });
  await page.goto("/admin");
  await page.getByLabel("관리자 키").fill("blog-test-key");
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByRole("button", { name: "테이블에 저장" })).toBeVisible();
  await expect(page.getByText("Paper figure")).toBeVisible();
});
