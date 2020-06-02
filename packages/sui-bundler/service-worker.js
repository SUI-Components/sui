/* eslint-env serviceworker */

// will be replaced in build time by the real manifest.json content
const manifestStatics = require('static-manifest')()
// will be replaced in build time by the current timestamp
const cacheName = require('static-cache-name')()

const OFFLINE_URL = 'offline.html'
let supportsResponseBodyStream

/**
 * Checks for browser response.body stream compatibility
 * @returns {boolean}
 */
function canConstructResponseFromBodyStream() {
  if (supportsResponseBodyStream === undefined) {
    const testResponse = new Response('')

    if ('body' in testResponse) {
      try {
        // eslint-disable-next-line no-new
        new Response(testResponse.body)
        supportsResponseBodyStream = true
      } catch (error) {
        supportsResponseBodyStream = false
      }
    }
    supportsResponseBodyStream = false
  }

  return supportsResponseBodyStream
}

/**
 * Clones a response as it's not possible to reuse those we save in cache
 * @param {Object} response
 * @returns {Response}
 */
const copyResponse = async function(response) {
  const clonedResponse = response.clone()

  const responseInit = {
    headers: new Headers(clonedResponse.headers),
    status: clonedResponse.status,
    statusText: clonedResponse.statusText
  }

  // Create the new response from the body stream and `ResponseInit`
  // modifications. Note: not all browsers support the Response.body stream,
  // so fall back to reading the entire body into memory as a blob.
  const body = canConstructResponseFromBodyStream()
    ? clonedResponse.body
    : await clonedResponse.blob()

  return new Response(body, responseInit)
}

self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys()
  const oldCacheNames = cacheNames.filter(name => cacheName !== name)
  await Promise.all(
    oldCacheNames.map(cacheName => {
      return caches.delete(cacheName)
    })
  )
  self.clients.claim()
})

/**
 * Loads the offline page and adds it to the cache
 * Adds to the cache all requests except the runtime chunks
 */
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName)
      // Setting {cache: 'reload'} in the new request will ensure that the response
      // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
      await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}))
      await cache.addAll(manifestStatics)
    })()
  )
})

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported.
          const preloadResponse = await event.preloadResponse
          if (preloadResponse) {
            return preloadResponse
          }

          const networkResponse = await fetch(event.request)
          return networkResponse
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is likely
          // due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.

          const cache = await caches.open(cacheName)
          const cachedResponse = await cache.match(OFFLINE_URL)

          return copyResponse(cachedResponse)
        }
      })()
    )
  } else {
    event.respondWith(
      caches.open(cacheName).then(cache => {
        return cache.match(event.request).then(response => {
          return fetch(event.request).then(response => {
            return response
          })
        })
      })
    )
  }
})
