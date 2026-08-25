import { test, expect } from "@playwright/test";

test("published surfaces do not show AI authorship copy", async ({ page }) => {
  for (const path of ["/", "/news", "/about", "/disclaimer"]) {
    await page.goto(path);
    await expect(page.getByText("AI 작성")).toHaveCount(0);
    await expect(page.getByText("AI가 작성")).toHaveCount(0);
  }
});
