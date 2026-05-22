const CACHE = "tharpu-school-v2";
const ASSETS = [
  "/tharpumavi.github.io/",
  "/tharpumavi.github.io/index.htm",
  "/tharpumavi.github.io/manifest.json",
  "/tharpumavi.github.io/icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        return caches.open(CACHE).then(c => {
          c.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(() => caches.match("/tharpumavi.github.io/index.htm"))
  );
});
