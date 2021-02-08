// __MAGIC IMPORTS__
// They came from {SPA}/node_modules or {SPA}/src
import React from 'react'
import {Router} from '@s-ui/react-router'
import {HeadProvider} from '@s-ui/react-head'
import {renderHeadTagsToString} from '@s-ui/react-head/lib/server'
import {ssrComponentWithInitialProps} from '@s-ui/react-initial-props'
// END __MAGIC IMPORTS__

import qs from 'querystring'
import {getTplParts, HtmlBuilder} from '../template'
import replaceWithLoadCSSPolyfill from '../template/cssrelpreload'
import withAllContexts from '@s-ui/hoc/lib/withAllContexts'
import withSUIContext from '@s-ui/hoc/lib/withSUIContext'
import {buildDeviceFrom} from '../../build-device'
import ssrConfig from '../config'
import {getInitialContextValue} from '../initialContextValue'

// __MAGIC IMPORTS__
let contextProviders
try {
  contextProviders = require('contextProviders').default
} catch (e) {
  contextProviders = []
}

// END __MAGIC IMPORTS__

// const SERVER_TIMING_HEADER = 'Server-Timing'
const HTTP_PERMANENT_REDIRECT = 301
const HEAD_OPENING_TAG = '<head>'
const HEAD_CLOSING_TAG = '</head>'

const formatServerTimingHeader = metrics =>
  Object.entries(metrics)
    .reduce((acc, [name, value]) => `${acc}${name};dur=${value},`, '')
    .replace(/(,$)/g, '')

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
    return res.redirect(HTTP_PERMANENT_REDIRECT, destination)
  }

  if (!renderProps) {
    // This case will never happen if a "*" path is implemented for not-found pages.
    // If the path "*" is not implemented, in case of having `loadSPAOnNotFound: true`,
    // the app (client side) won't respond either so the same result is obtained with
    // the following line (best performance) than explicitly passing an error using
    // `next(new Error(404))`
    return next() // We asume that is a 404 page
  }

  if (criticalCSS) {
    let nextHeadTplPart = headTplPart
      .replace(
        HEAD_OPENING_TAG,
        `${HEAD_OPENING_TAG}<style id="critical">${criticalCSS}</style>`
      )
      .replace(
        'rel="stylesheet"',
        'rel="stylesheet" media="only x" as="style" onload="this.media=\'all\';var e=document.getElementById(\'critical\');e.parentNode.removeChild(e);"'
      )
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
    res.type(ssrConfig.serverContentType)
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
      (acc, {provider, props}) => React.createElement(provider, props, acc),
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
    const {redirectTo} = __HTTP__
    if (redirectTo) {
      return res.redirect(HTTP_PERMANENT_REDIRECT, redirectTo)
    }
  }

  // Flush now if early-flush is disabled
  if (!req.app.locals.earlyFlush) {
    res.type(ssrConfig.serverContentType)
    res.flush()
  }

  // The first html content has the be set after any possible call to next().
  // Otherwise some undesired/duplicated html could be attached to the error pages if an error occurs
  // no matter the error page strategy set (loadSPAOnNotFound: true|false)
  const {bodyAttributes, headString, htmlAttributes} = renderHeadTagsToString(
    headTags
  )

  res.set({
    'Server-Timing': formatServerTimingHeader({
      ...performance,
      ...ssrPerformance
    })
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
