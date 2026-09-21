const CACHE_NAME = "brothershop-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./logo-transparent.png",
  "./alma-toran.ttf",
  "./af1-white.jpg",
  "./am270-black.jpg",
  "./balenciaga-speed.jpg",
  "./mcqueen-oversized.jpg"
];

// Instala el service worker y guarda los archivos base en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Limpia versiones viejas de caché cuando se activa una nueva
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Estrategia: intenta la red primero (para no quedarse con versiones viejas
// de las imágenes/páginas); si no hay conexión, usa lo que haya en caché.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
