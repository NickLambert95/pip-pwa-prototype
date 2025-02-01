const CACHE_NAME = 'media-cache-v1';
const MEDIA_URLS = ['https://test-streams.mux.dev/'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener('fetch', (event) => {
  if (MEDIA_URLS.some(url => event.request.url.includes(url))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => 
        cache.match(event.request).then(res => 
          res || fetch(event.request).then(fetchRes => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          })
        )
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
