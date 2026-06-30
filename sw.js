// Service worker: saves the REAL Google Translate TTS audio the first time a word is played,
// then replays it from disk forever after — instant, offline, and no robotic fallback voice.
//
// Why this works where fetch()-to-save did not: we never READ the audio bytes in JS (that is
// what Google's missing CORS header blocks). The service worker just stores the response and
// hands it back to the <audio> element, which can play it even as an opaque cross-origin body.

const CACHE = "tts-cache-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  // Only touch the Google TTS audio. Everything else goes straight to the network untouched.
  if (event.request.method !== "GET" || url.indexOf("translate_tts") === -1) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // Key by the URL string (the ?q=<word> makes each word unique). Keying by string avoids
    // Range/Vary mismatches so a cached clip always matches on replay.
    const cached = await cache.match(url);
    if (cached) return cached; // saved Google voice — play from disk, no network

    try {
      const resp = await fetch(url); // cross-origin media = opaque response (type "opaque", status 0)
      if (resp && (resp.ok || resp.type === "opaque")) {
        cache.put(url, resp.clone()).catch(() => {}); // save it for next time
      }
      return resp;
    } catch (e) {
      // Offline and this word was never cached yet — let the page's own fallback handle it.
      return new Response("", { status: 504 });
    }
  })());
});
