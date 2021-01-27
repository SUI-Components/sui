/* eslint-env serviceworker */

// will be replaced by the importScripts
// IMPORT_SCRIPTS_HERE

// will be replaced in build time by the real manifest.json content
const manifestStatics = require('static-manifest')
// will be replaced in build time by the current timestamp
const cacheName = require('static-cache-name')
// will be replaced in build time and set to true if offline.staticsCacheOnly flag activated
const staticsCacheOnly = require('static-statics-cache-only')

const OFFLINE_PAGE = 'offline.html'
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
 * @returns {Promise<Response>}
 */
const copyResponse = async function(response) {
  const clonedResponse = response.clone()

  const responseInit = {
    headers: new Headers(clonedResponse.headers),
    status: clonedResponse.status,
    statusText: clonedResponse.statusText
  }

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
      await cache.addAll(
        manifestStatics.map(url => {
          return new Request(url, {
            cache: 'reload'
          })
        })
      )
      if (staticsCacheOnly) return
      // Setting {cache: 'reload'} in the new request will ensure that the response
      // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
      await cache.add(
        new Request(OFFLINE_PAGE, {
          cache: 'reload'
        })
      )
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
          if (staticsCacheOnly) throw error
          // catch is only triggered if an exception is thrown, which is likely
          // due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.
          const cache = await caches.open(cacheName)
          const cachedResponse = await cache.match(OFFLINE_PAGE)

          return copyResponse(cachedResponse)
        }
      })()
    )
  }
})

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(cacheName)
        const cachedResponse = await cache.match(event.request)
        if (cachedResponse) return cachedResponse

        const fetchResponse = await fetch(event.request)
        return fetchResponse
      })()
    )
  }
})
