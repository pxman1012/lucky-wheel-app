// Service worker: giúp app mở được khi mất mạng.
// - Trang (navigate): ưu tiên mạng, mất mạng thì dùng bản đã lưu.
// - Tài nguyên tĩnh (/_next/static, /icons): ưu tiên cache vì file có hash, không đổi.
const CACHE_NAME = "lucky-wheel-v4";
const PRECACHE_URLS = ["/", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => k !== CACHE_NAME)
                        .map((k) => caches.delete(k)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((res) => {
                    if (res.ok) {
                        const copy = res.clone();
                        caches
                            .open(CACHE_NAME)
                            .then((c) => c.put(request, copy));
                    }
                    return res;
                })
                .catch(() =>
                    caches
                        .match(request)
                        .then((hit) => hit || caches.match("/")),
                ),
        );
        return;
    }

    if (
        url.pathname.startsWith("/_next/static/") ||
        url.pathname.startsWith("/icons/") ||
        url.pathname.startsWith("/foods/") ||
        url.pathname.startsWith("/logos/") ||
        url.pathname.startsWith("/flags/")
    ) {
        event.respondWith(
            caches.match(request).then(
                (hit) =>
                    hit ||
                    fetch(request).then((res) => {
                        if (res.ok) {
                            const copy = res.clone();
                            caches
                                .open(CACHE_NAME)
                                .then((c) => c.put(request, copy));
                        }
                        return res;
                    }),
            ),
        );
    }
});
