// @ts-check

/* globals __webpack_hash__ */

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict'

// This alternative WebpackDevServer combines the functionality of:
// https://github.com/webpack/webpack-dev-server/blob/webpack-1/client/index.js
// https://github.com/webpack/webpack/blob/webpack-1/hot/dev-server.js

// It only supports their simplest configuration (hot updates on same server).
// It makes some opinionated choices on top, like adding a syntax error overlay
// that looks similar to our console output. The error overlay is inspired by:
// https://github.com/glenjamin/webpack-hot-middleware

const stripAnsi = require('strip-ansi')
const url = require('url')
const formatWebpackMessages = require('./formatWebpackMessages.js')

// We need to keep track of if there has been a runtime error.
// Essentially, we cannot guarantee application state was not corrupted by the
// runtime error. To prevent confusing behavior, we forcibly reload the entire
// application. This is handled below when we are notified of a compile (code
// change).
// See https://github.com/facebook/create-react-app/issues/3096
const hadRuntimeError = false

// Connect to WebpackDevServer via a socket.
const connection = new WebSocket(
  url.format({
    protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',
    hostname: process.env.WDS_SOCKET_HOST || window.location.hostname,
    port: process.env.WDS_SOCKET_PORT || window.location.port,
    // Hardcoded in WebpackDevServer
    pathname: process.env.WDS_SOCKET_PATH || '/ws',
    slashes: true
  })
)

// Unlike WebpackDevServer client, we won't try to reconnect
// to avoid spamming the console. Disconnect usually happens
// when developer stops the server.
connection.onclose = function() {
  if (typeof console !== 'undefined' && typeof console.info === 'function') {
    console.info(
      'The development server has disconnected.\nRefresh the page if necessary.'
    )
  }
}

// Remember some state related to hot module replacement.
let isFirstCompilation = true
let mostRecentCompilationHash = null
let hasCompileErrors = false

function clearOutdatedErrors() {
  // Clean up outdated compile errors, if any.
  if (typeof console !== 'undefined' && typeof console.clear === 'function') {
    if (hasCompileErrors) {
      console.clear()
    }
  }
}

// Successful compilation.
function handleSuccess() {
  clearOutdatedErrors()

  const isHotUpdate = !isFirstCompilation
  isFirstCompilation = false
  hasCompileErrors = false

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    tryApplyUpdates()
  }
}

// Compilation with warnings (e.g. ESLint).
function handleWarnings(warnings) {
  clearOutdatedErrors()

  const isHotUpdate = !isFirstCompilation
  isFirstCompilation = false
  hasCompileErrors = false

  function printWarnings() {
    // Print warnings to the console.
    const formatted = formatWebpackMessages({
      warnings: warnings,
      errors: []
    })

    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      for (let i = 0; i < formatted.warnings.length; i++) {
        if (i === 5) {
          console.warn(
            'There were more warnings in other files.\n' +
              'You can find a complete log in the terminal.'
          )
          break
        }
        console.warn(stripAnsi(formatted.warnings[i]))
      }
    }
  }

  printWarnings()

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    tryApplyUpdates()
  }
}

// Compilation with errors (e.g. syntax error or missing modules).
function handleErrors(errors) {
  clearOutdatedErrors()

  isFirstCompilation = false
  hasCompileErrors = true

  // "Massage" webpack messages.
  const formatted = formatWebpackMessages({
    errors: errors,
    warnings: []
  })

  // Also log them to the console.
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    for (let i = 0; i < formatted.errors.length; i++) {
      console.error(stripAnsi(formatted.errors[i]))
    }
  }

  // Do not attempt to reload now.
  // We will reload on next success instead.
}

// There is a newer version of the code available.
function handleAvailableHash(hash) {
  // Update last known compilation hash.
  mostRecentCompilationHash = hash
}

// Handle messages from the server.
connection.onmessage = function(e) {
  const message = JSON.parse(e.data)
  switch (message.type) {
    case 'hash':
      handleAvailableHash(message.data)
      break
    case 'still-ok':
    case 'ok':
      handleSuccess()
      break
    case 'content-changed':
      // Triggered when a file from `contentBase` changed.
      window.location.reload()
      break
    case 'warnings':
      handleWarnings(message.data)
      break
    case 'errors':
      handleErrors(message.data)
      break
    default:
    // Do nothing.
  }
}

// Is there a newer version of this code available?
function isUpdateAvailable() {
  // __webpack_hash__ is the hash of the current compilation.
  // It's a global variable injected by webpack.
  // eslint-disable-next-line camelcase
  return mostRecentCompilationHash !== __webpack_hash__
}

// webpack disallows updates in other states.
function canApplyUpdates() {
  return module.hot.status() === 'idle'
}

function canAcceptErrors() {
  // NOTE: This var is injected by Webpack's DefinePlugin, and is a boolean instead of string.
  const hasReactRefresh = process.env.FAST_REFRESH

  const status = module.hot.status()
  // React refresh can handle hot-reloading over errors.
  // However, when hot-reload status is abort or fail,
  // it indicates the current update cannot be applied safely,
  // and thus we should bail out to a forced reload for consistency.
  return hasReactRefresh && ['abort', 'fail'].indexOf(status) === -1
}

// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates(onHotUpdateSuccess) {
  if (!module.hot) {
    // HotModuleReplacementPlugin is not in webpack configuration.
    window.location.reload()
    return
  }

  if (!isUpdateAvailable() || !canApplyUpdates()) {
    return
  }

  function handleApplyUpdates(err, updatedModules) {
    const haveErrors = err || hadRuntimeError
    // When there is no error but updatedModules is unavailable,
    // it indicates a critical failure in hot-reloading,
    // e.g. server is not ready to serve new bundle,
    // and hence we need to do a forced reload.
    const needsForcedReload = !err && !updatedModules
    if ((haveErrors && !canAcceptErrors()) || needsForcedReload) {
      window.location.reload()
      return
    }

    if (typeof onHotUpdateSuccess === 'function') {
      // Maybe we want to do something.
      onHotUpdateSuccess()
    }

    if (isUpdateAvailable()) {
      // While we were updating, there was a new update! Do it again.
      tryApplyUpdates()
    }
  }

  // https://webpack.github.io/docs/hot-module-replacement.html#check
  const result = module.hot.check(/* autoApply */ true, handleApplyUpdates)

  // // webpack 2 returns a Promise instead of invoking a callback
  if (result && result.then) {
    result.then(
      function(updatedModules) {
        handleApplyUpdates(null, updatedModules)
      },
      function(err) {
        handleApplyUpdates(err, null)
      }
    )
  }
}
