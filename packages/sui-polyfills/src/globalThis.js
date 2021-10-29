/* global __magic__ */
// extracted from: https://mathiasbynens.be/notes/globalthis

;(function() {
  if (typeof globalThis === 'object') return
  Object.prototype.__defineGetter__('__magic__', function() {
    return this
  })
  __magic__.globalThis = __magic__
  delete Object.prototype.__magic__
})()
