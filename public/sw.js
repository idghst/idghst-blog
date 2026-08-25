self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", () => {
  // ponytail: installability only. intercepting fetch breaks live pages and API mocks.
});
