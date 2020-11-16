/* eslint-disable no-var */
export var buildDeviceFrom = function(params) {
  var win = params.window
  var request = params.request
  request = request === undefined ? {} : request
  win = win === undefined ? {} : win

  return {
    // https://tc39.github.io/proposal-optional-chaining/
    userAgent:
      (request.headers && request.headers['user-agent']) ||
      (win.navigator && win.navigator.userAgent)
  }
}
