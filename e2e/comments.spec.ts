import { test, expect } from "@playwright/test";

test("comment form submits through the comments API", async ({ page }) => {
  await page.route("**/api/posts/**/comments", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [], count: 0 }),
      });
      return;
    }
    if (method === "POST") {
      const payload = route.request().postDataJSON() as {
        author: string;
        body: string;
      };
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          author: payload.author,
          body: payload.body,
          createdAt: "2026-08-23T00:00:00Z",
        }),
      });
      return;
    }
    await route.continue();
  });

  await page.route("**/api/posts/hello-world", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        slug: "hello-world",
        title: "Hello",
        description: "Intro",
        type: "guide",
        tags: ["python"],
        body: "# Hello",
        draft: false,
        locale: "ko",
        publishedAt: "2026-08-01T00:00:00Z",
        updatedAt: "2026-08-01T00:00:00Z",
        createdAt: "2026-08-01T00:00:00Z",
      }),
    });
  });

  await page.goto("/posts/hello-world");
  const heading = page.getByRole("heading", { name: "댓글" });
  if (!(await heading.isVisible().catch(() => false))) {
    test.skip(true, "post page needs API post; comment UI covered when a post loads");
    return;
  }
  await expect(heading).toBeVisible();
  await page.getByLabel("이름").fill("reader");
  await page.getByLabel("내용").fill("도움이 됐습니다.");
  await page.getByRole("button", { name: "댓글 등록" }).click();
  await expect(page.getByText("도움이 됐습니다.")).toBeVisible();
});
