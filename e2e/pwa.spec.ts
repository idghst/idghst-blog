import { test, expect } from "@playwright/test";

test("manifest is installable", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBeTruthy();
  const manifest = (await res.json()) as {
    name: string;
    short_name: string;
    display: string;
    start_url: string;
    icons: { src: string; sizes: string }[];
  };
  expect(manifest.name).toContain("IDGHST");
  expect(manifest.short_name).toBe("IDGHST");
  expect(manifest.display).toBe("standalone");
  expect(manifest.start_url).toMatch(/^\//);
  expect(manifest.icons.some((icon) => icon.sizes.includes("192"))).toBeTruthy();
  expect(manifest.icons.some((icon) => icon.sizes.includes("512"))).toBeTruthy();
});

test("service worker script is served", async ({ request }) => {
  const res = await request.get("/sw.js");
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toContain("addEventListener");
  expect(body).toContain("fetch");
});

test("favicon is served", async ({ request }) => {
  const res = await request.get("/favicon.ico");
  expect(res.ok()).toBeTruthy();
  expect(res.headers()["content-type"] ?? "").toMatch(/icon|octet-stream/);
});

test("PWA icons exist", async ({ request }) => {
  for (const path of [
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/apple-touch-icon.png",
  ]) {
    const res = await request.get(path);
    expect(res.ok(), path).toBeTruthy();
    expect(res.headers()["content-type"] ?? "").toContain("image/png");
  }
});

test("install hint opens from the header", async ({ page }) => {
  await page.goto("/");
  const install = page.getByText("앱 설치", { exact: true });
  await expect(install).toBeVisible();
  await install.click();
  await expect(page.getByText(/앱을 설치|홈 화면에 추가/)).toBeVisible();
});

test("registers a service worker on the homepage", async ({ page }) => {
  await page.goto("/");
  await expect
    .poll(async () =>
      page.evaluate(async () => {
        if (!("serviceWorker" in navigator)) return "";
        const ready = await navigator.serviceWorker.ready;
        return ready.active?.scriptURL ?? "";
      }),
    )
    .toContain("/sw.js");
});
