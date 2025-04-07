import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST || [],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// Handle network status updates
self.addEventListener("online", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) =>
      client.postMessage({ type: "ONLINE_STATUS", status: "online" })
    );
  });
});

self.addEventListener("offline", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) =>
      client.postMessage({ type: "ONLINE_STATUS", status: "offline" })
    );
  });
});

// Force cache refresh if ?refresh is present in image URL
self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);

  // Only handle requests from external image domain
  if (url.hostname === "http://jealous-red-zebra.myfilebase.com") {
    const cache = await caches.open("image-cache");

    // If "?refresh" exists, delete the cached version to fetch a fresh copy
    if (url.searchParams.has("refresh")) {
      await cache.delete(event.request);
      console.log(`Cache refreshed for image: ${url.href}`);
    }

    event.respondWith(
      cache.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetchAndCache(event.request, cache);
      })
    );
  }
});

async function fetchAndCache(request, cache) {
  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}
