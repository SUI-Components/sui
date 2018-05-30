'use strict'
/* eslint-disable no-console */
exports.register = function(_ref) {
  var first = _ref.first
  var renovate = _ref.renovate
  return function() {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        var swUrl = '/service-worker.js'
        navigator.serviceWorker
          .register(swUrl)
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
}

exports.unregister = function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.unregister()
    })
  }
}
