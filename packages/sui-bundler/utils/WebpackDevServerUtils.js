// @ts-check

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict'

const address = require('address')
const fs = require('fs')
const path = require('path')
const url = require('url')

const {findFreePorts, isFreePort} = require('find-free-ports')

const clearConsole = require('./clearConsole.js')
const getProcessForPort = require('./getProcessForPort.js')

const {bold, cyan, green, red} = require('@s-ui/helpers/colors')

const isInteractive = process.stdout.isTTY

function prepareUrls(protocol, host, port, pathname = '/') {
  const formatUrl = hostname =>
    url.format({
      protocol,
      hostname,
      port,
      pathname
    })

  const prettyPrintUrl = hostname =>
    url.format({
      protocol,
      hostname,
      port: bold(port),
      pathname
    })

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::'
  let prettyHost, lanUrlForConfig, lanUrlForTerminal

  if (isUnspecifiedHost) {
    prettyHost = 'localhost'
    try {
      // This can only return an IPv4 address
      lanUrlForConfig = address.ip()
      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
          // Address is private, format it for later use
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig)
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined
        }
      }
    } catch (_e) {
      // ignored
    }
  } else {
    prettyHost = host
  }

  const localUrlForTerminal = prettyPrintUrl(prettyHost)
  const localUrlForBrowser = formatUrl(prettyHost)
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser
  }
}

function printInstructions({urls}) {
  console.log(`You can now view the app in the browser.`)
  console.log()

  if (urls.lanUrlForTerminal) {
    console.log(`  ${bold('Local:')}            ${urls.localUrlForTerminal}`)
    console.log(`  ${bold('On Your Network:')}  ${urls.lanUrlForTerminal}`)
  } else {
    console.log(`  ${urls.localUrlForTerminal}`)
  }

  console.log()
  console.log('Note that the development build is not optimized.')
  console.log('To create a production build, use npm run build')
  console.log()
}

// We need to provide a custom onError function for httpProxyMiddleware.
// It allows us to log custom error messages on the console.
function onProxyError(proxy) {
  return (err, req, res) => {
    const host = req.headers && req.headers.host
    const error = `Proxy error: Could not proxy request ${req.url} from ${host} to ${proxy} (${err.code})`
    console.log(error)

    console.log(
      'See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (' +
        cyan(err.code) +
        ').'
    )

    // And immediately send the proper error response to the client.
    // Otherwise, the request will eventually timeout with ERR_EMPTY_RESPONSE on the client side.
    if (res.writeHead && !res.headersSent) {
      res.writeHead(500)
    }

    res.end(error)
  }
}

function prepareProxy(proxy, appPublicFolder, servedPathname) {
  // `proxy` lets you specify alternate servers for specific requests.
  if (!proxy) return undefined

  if (typeof proxy !== 'string') {
    console.log(red('When specified, "proxy" in package.json must be a string.'))
    console.log(red('Instead, the type of "proxy" was "' + typeof proxy + '".'))
    console.log(red('Either remove "proxy" from package.json, or make it a string.'))
    process.exit(1)
  }

  // If proxy is specified, let it handle any request except for
  // files in the public folder and requests to the WebpackDevServer socket endpoint.
  // https://github.com/facebook/create-react-app/issues/6720
  const sockPath = process.env.WDS_SOCKET_PATH || '/ws'
  const isDefaultSockHost = !process.env.WDS_SOCKET_HOST
  function mayProxy(pathname) {
    const maybePublicPath = path.resolve(appPublicFolder, pathname.replace(new RegExp('^' + servedPathname), ''))
    const isPublicFileRequest = fs.existsSync(maybePublicPath)
    // used by webpackHotDevClient
    const isWdsEndpointRequest = isDefaultSockHost && pathname.startsWith(sockPath)
    return !(isPublicFileRequest || isWdsEndpointRequest)
  }

  if (!/^http(s)?:\/\//.test(proxy)) {
    console.log(red('When "proxy" is specified in package.json it must start with either http:// or https://'))
    process.exit(1)
  }

  const target = proxy

  return [
    {
      target,
      logLevel: 'silent',
      // For single page apps, we generally want to fallback to /index.html.
      // However we also want to respect `proxy` for API calls.
      // So if `proxy` is specified as a string, we need to decide which fallback to use.
      // We use a heuristic: We want to proxy all the requests that are not meant
      // for static assets and as all the requests for static assets will be using
      // `GET` method, we can proxy all non-`GET` requests.
      // For `GET` requests, if request `accept`s text/html, we pick /index.html.
      // Modern browsers include text/html into `accept` header when navigating.
      // However API calls like `fetch()` won’t generally accept text/html.
      // If this heuristic doesn’t work well for you, use `src/setupProxy.js`.
      context: function (pathname, req) {
        return (
          req.method !== 'GET' ||
          (mayProxy(pathname) && req.headers.accept && req.headers.accept.indexOf('text/html') === -1)
        )
      },
      onProxyReq: proxyReq => {
        // Browsers may send Origin headers even with same-origin
        // requests. To prevent CORS issues, we have to change
        // the Origin to match the target URL.
        if (proxyReq.getHeader('origin')) {
          proxyReq.setHeader('origin', target)
        }
      },
      onError: onProxyError(target),
      secure: false,
      changeOrigin: true,
      ws: true,
      xfwd: true
    }
  ]
}

async function choosePort(defaultPort) {
  const isDefaultPortFree = await isFreePort(defaultPort)
  if (isDefaultPortFree) return defaultPort

  console.log(`Something is already running on port ${defaultPort}.`)

  const [freePort] = await findFreePorts(1, {startPort: 3000})

  if (isInteractive) {
    clearConsole()
    const existingProcess = getProcessForPort(defaultPort)
    if (existingProcess) {
      console.log(`It seems that ${existingProcess} is using the default port.`)
      console.log(green(`Using free port: ${freePort} instead.`))
    }
    return freePort
  }
}

module.exports = {
  choosePort,
  printInstructions,
  prepareProxy,
  prepareUrls
}
