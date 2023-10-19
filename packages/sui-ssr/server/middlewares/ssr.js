// __MAGIC IMPORTS__
// They came from {SPA}/node_modules or {SPA}/src
// END __MAGIC IMPORTS__
import qs from 'querystring'

import {createElement} from 'react'

import withAllContexts from '@s-ui/hoc/lib/withAllContexts'
import withSUIContext from '@s-ui/hoc/lib/withSUIContext'
import {HeadProvider} from '@s-ui/react-head'
import {renderHeadTagsToString} from '@s-ui/react-head/lib/server'
import {ssrComponentWithInitialProps} from '@s-ui/react-initial-props'
import {Router} from '@s-ui/react-router'

import {buildDeviceFrom} from '../../build-device.js'
import {
  DEFAULT_REDIRECT_STATUS_CODE,
  redirectStatusCodes
} from '../../status-codes.js'
import ssrConfig from '../config.js'
import {getInitialContextValue} from '../initialContextValue/index.js'
import replaceWithLoadCSSPolyfill from '../template/cssrelpreload.js'
import {getTplParts, HtmlBuilder} from '../template/index.js'
import {createStylesFor} from '../utils/index.js'

// __MAGIC IMPORTS__
let contextProviders
try {
  contextProviders = require('contextProviders').default
} catch (e) {
  contextProviders = []
}

// END __MAGIC IMPORTS__

// const SERVER_TIMING_HEADER = 'Server-Timing'
const HEAD_OPENING_TAG = '<head>'
const HEAD_CLOSING_TAG = '</head>'

// const CSP_REPORT_PATH = '/csp-report'

const formatServerTimingHeader = metrics =>
  Object.entries(metrics)
    .reduce((acc, [name, value]) => `${acc}${name};dur=${value},`, '')
    .replace(/(,$)/g, '')

const cssLinksRegExp = /<link([^>]*)rel="stylesheet"([^<]*)>/g

const convertToAsyncLinks = (allMatch, startingAttrs, endingAttrs) => {
  const isAlreadyAsync = allMatch.includes('onload')
  if (isAlreadyAsync) return allMatch
  return `<link${startingAttrs}${ssrConfig.ASYNC_CSS_ATTRS}${endingAttrs}>`
}

export default async (req, res, next) => {
  const {
    context,
    criticalCSS,
    matchResult = {},
    performance,
    query,
    skipSSR
  } = req
  const {error, redirectLocation, renderProps} = matchResult

  let [headTplPart, bodyTplPart] = getTplParts(req)

  if (skipSSR) {
    return next()
  }

  if (error) {
    return next(error)
  }

  if (redirectLocation) {
    const queryString = Object.keys(query).length
      ? `?${qs.stringify(query)}`
      : ''
    const destination = `${redirectLocation.pathname}${queryString}`
    return res.redirect(DEFAULT_REDIRECT_STATUS_CODE, destination)
  }

  if (!renderProps) {
    // This case will never happen if a "*" path is implemented for not-found pages.
    return next() // We asume that is a 404 page
  }

  const hasCriticalCSS = criticalCSS && criticalCSS !== ''

  // get the pageComponent and its displayName to retrieve its styles
  const pageComponent =
    renderProps.components[renderProps.components.length - 1]
  const pageName = pageComponent.displayName

  if (ssrConfig.createStylesFor && pageName) {
    const pageStyles = createStylesFor({pageName, async: hasCriticalCSS, req})
    let nextHeadTplPart = headTplPart.replace(
      HEAD_OPENING_TAG,
      `${HEAD_OPENING_TAG}${pageStyles}`
    )
    headTplPart = (' ' + nextHeadTplPart).slice(1)
    nextHeadTplPart = null
  }

  if (hasCriticalCSS) {
    let nextHeadTplPart = headTplPart
      .replace(
        HEAD_OPENING_TAG,
        `${HEAD_OPENING_TAG}<style id="critical">${criticalCSS}</style>`
      )
      .replace(cssLinksRegExp, convertToAsyncLinks)
      .replace(
        HEAD_CLOSING_TAG,
        `${replaceWithLoadCSSPolyfill(HEAD_CLOSING_TAG)}`
      )
    headTplPart = (' ' + nextHeadTplPart).slice(1)
    nextHeadTplPart = null
  }

  const device = buildDeviceFrom({request: req})

  // Flush if early-flush is enabled
  if (req.app.locals.earlyFlush) {
    res.type('html')
    res.flush()
  }

  let initialData
  const headTags = []

  const InitialContext = routerProps =>
    [
      {
        provider: Router,
        props: routerProps
      },
      {
        provider: HeadProvider,
        props: {headTags}
      },
      ...(typeof contextProviders === 'function'
        ? contextProviders({context})
        : contextProviders)
    ].reduce(
      (acc, {provider, props}) => createElement(provider, props, acc),
      null
    )

  try {
    initialData = await ssrComponentWithInitialProps({
      context: {...context, device},
      renderProps,
      req,
      res,
      Target: ssrConfig.useLegacyContext
        ? withAllContexts({...context, device})(InitialContext)
        : withSUIContext({...context, device})(InitialContext)
    })
  } catch (err) {
    return next(err)
  }

  const {initialProps, reactString, performance: ssrPerformance} = initialData

  // The __HTTP__ object is created before earlyFlush is applied
  // to avoid unexpected behaviors

  const {__HTTP__} = initialProps
  if (__HTTP__) {
    const {redirectTo, redirectStatusCode, httpCookie, headers} = __HTTP__

    if (httpCookie) {
      const [[field, value]] = Object.entries(httpCookie)
      res.cookie(field, value, {httpOnly: true})
    }

    if (headers) {
      headers.forEach(header => {
        const [[field, value]] = Object.entries(header)
        res.append(field, value)
      })
    }

    if (redirectTo) {
      const isValidRedirectStatusCode =
        redirectStatusCodes.includes(redirectStatusCode)
      const validRedirectStatusCode = isValidRedirectStatusCode
        ? redirectStatusCode
        : DEFAULT_REDIRECT_STATUS_CODE

      return res.redirect(validRedirectStatusCode, redirectTo)
    }
  }

  // Flush now if early-flush is disabled
  if (!req.app.locals.earlyFlush) {
    res.type('html')
    res.flush()
  }

  // The first html content has the be set after any possible call to next().
  // Otherwise some undesired/duplicated html could be attached to the error pages if an error occurs
  const {bodyAttributes, headString, htmlAttributes} =
    renderHeadTagsToString(headTags)

  res.set({
    'Server-Timing': formatServerTimingHeader({
      ...performance,
      ...ssrPerformance
    })
    // 'Content-Security-Policy-Report-Only': `default-src 'self'; report-uri ${CSP_REPORT_PATH}`
  })
  res.write(HtmlBuilder.buildHead({headTplPart, headString, htmlAttributes}))
  res.flush()

  res.end(
    HtmlBuilder.buildBody({
      bodyAttributes,
      bodyTplPart,
      reactString,
      appConfig: req.appConfig,
      initialProps,
      performance,
      initialContextValue: getInitialContextValue(context)
    })
  )
}
