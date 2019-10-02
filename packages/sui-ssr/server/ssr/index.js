// __MAGIC IMPORTS__
// They came from {SPA}/node_modules or {SPA}/src
import routes from 'routes'
import {RouterContext, match} from 'react-router'
import Helmet from 'react-helmet'
import {
  createServerContextFactoryParams,
  ssrComponentWithInitialProps
} from '@s-ui/react-initial-props'
// END __MAGIC IMPORTS__

import qs from 'querystring'
import {getTplParts, HtmlBuilder} from '../template'
import replaceWithLoadCSSPolyfill from '../template/cssrelpreload'
import withAllContexts from '@s-ui/hoc/lib/withAllContexts'
import withSUIContext from '@s-ui/hoc/lib/withSUIContext'
import {buildDeviceFrom} from '../../build-device'
import ssrConfig from '../config'

// __MAGIC IMPORTS__
let contextFactory
try {
  contextFactory = require('contextFactory').default
} catch (e) {
  contextFactory = async () => ({})
}
// END __MAGIC IMPORTS__

// const SERVER_TIMING_HEADER = 'Server-Timing'
const HTTP_PERMANENT_REDIRECT = 301
const HEAD_OPENING_TAG = '<head>'
const HEAD_CLOSING_TAG = '</head>'

const useLegacyContext =
  typeof ssrConfig.useLegacyContext !== 'undefined'
    ? ssrConfig.useLegacyContext
    : true

const initialFlush = res => {
  res.type('html')
  res.flush()
}

export default (req, res, next) => {
  const {url, query} = req
  let [headTplPart, bodyTplPart] = getTplParts(req)
  const criticalCSS = req.criticalCSS

  if (criticalCSS) {
    headTplPart = headTplPart
      .replace(
        HEAD_OPENING_TAG,
        `${HEAD_OPENING_TAG}<style>${criticalCSS}</style>`
      )
      .replace(
        'rel="stylesheet"',
        'rel="stylesheet" media="only x" as="style" onload="this.media=\'all\'"'
      )
      .replace(HEAD_CLOSING_TAG, replaceWithLoadCSSPolyfill(HEAD_CLOSING_TAG))
  }

  match(
    {routes, location: url},
    async (error, redirectLocation, renderProps) => {
      if (!error && redirectLocation) {
        const queryString = Object.keys(query).length
          ? `?${qs.stringify(query)}`
          : ''
        const destination = `${redirectLocation.pathname}${queryString}`
        return res.redirect(HTTP_PERMANENT_REDIRECT, destination)
      }

      if (error) {
        return next(error)
      }

      if (!renderProps) {
        // This case will never happen if a "*" path is implemented for not-found pages.
        // If the path "*" is not implemented, in case of having `loadSPAOnNotFound: true`,
        // the app (client side) won't respond either so the same result is obtained with
        // the following line (best performance) than explicitly passing an error using
        // `next(new Error(404))`
        return next() // We asume that is a 404 page
      }

      const device = buildDeviceFrom({request: req})

      // Flush if early-flush is enabled
      if (req.app.locals.earlyFlush) {
        initialFlush(res)
      }

      const context = await contextFactory(
        createServerContextFactoryParams(req)
      )

      let initialData

      try {
        initialData = await ssrComponentWithInitialProps({
          context: {...context, device},
          renderProps,
          Target: useLegacyContext
            ? withAllContexts({...context, device})(RouterContext)
            : withSUIContext({...context, device})(RouterContext)
        })
      } catch (err) {
        return next(err)
      }

      // Flush now if early-flush is disabled
      if (!req.app.locals.earlyFlush) {
        initialFlush(res)
      }

      const {initialProps, reactString, performance} = initialData

      const {__HTTP__} = initialProps
      if (__HTTP__) {
        const {redirectTo} = __HTTP__
        if (redirectTo) {
          return res.redirect(HTTP_PERMANENT_REDIRECT, __HTTP__.redirectTo)
        }
      }

      // The first html content has the be set after any possible call to next().
      // Otherwise some undesired/duplicated html could be attached to the error pages if an error occurs
      // no matter the error page strategy set (loadSPAOnNotFound: true|false)
      const helmet = Helmet.renderStatic()
      const {bodyAttributes, htmlAttributes, ...helmetHead} = helmet
      res.write(HtmlBuilder.buildHead({headTplPart, helmetHead}))
      res.flush()

      // res.set({
      //   'Server-Timing': `
      //   getInitialProps;desc=getInitialProps;dur=${performance.getInitialProps},
      //   renderToString;desc=renderToString;dur=${performance.renderToString}
      // `.replace(/\n/g, '')
      // })

      res.end(
        HtmlBuilder.buildBody({
          bodyAttributes,
          bodyTplPart,
          reactString,
          appConfig: req.appConfig,
          initialProps,
          performance
        })
      )
    }
  )
}
