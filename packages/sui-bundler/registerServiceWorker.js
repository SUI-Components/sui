/* eslint-disable no-var */

'use strict'

var noop = function() {}
var SW_URL = '/service-worker.js'

/* eslint-disable no-console */
exports.register = function(options) {
  options = options || {}
  var first = options.first || noop
  var renovate = options.renovate || noop

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker
        .register(SW_URL)
        .then(function(registration) {
          registration.onupdatefound = function() {
            var installingWorker = registration.installing
            installingWorker.onstatechange = function() {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the old content will have been purged and
                  // the fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in your web app.
                  renovate()
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a
                  // "Content is cached for offline use." message.
                  first()
                }
              }
            }
          }
        })
        .catch(function(error) {
          console.error('Error during service worker registration:', error)
        })
    })
  }
}

exports.unregister = function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.unregister()
    })
  }
}
