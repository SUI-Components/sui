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
import path from 'path'
import fs from 'fs'
import withContext from '@s-ui/hoc/lib/withContext'

import {buildDeviceFrom} from '../../build-device'

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
const INDEX_HTML_PATH = path.join(process.cwd(), 'public', 'index.html')
const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8')
const APP_PLACEHOLDER = '<!-- APP -->'

const injectDataHydration = ({windowPropertyName, data = {}}) =>
  `<script>window.${windowPropertyName} = ${JSON.stringify(data).replace(
    /<\//g,
    '<\\/'
  )};</script>`

const injectDataPerformance = ({
  getInitialProps: server,
  renderToString: render
} = {}) =>
  `<script>window.__PERFORMANCE_METRICS__ = ${JSON.stringify({
    server,
    render
  })}</script>`

const initialFlush = res => {
  res.type('html')
  res.flush()
}

export default (req, res, next) => {
  const {url, query} = req
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
        // If the path "*" is not implemented, in case of having `loadSPAOnNotFound: true`, the app won't work either
        // so the same result is obtained with the following line (best performance) than explicitly
        // passing an error using `next(new Error(404))`
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
          Target: withContext(context)(RouterContext)
        })
      } catch (err) {
        return next(err)
      }

      const {initialProps, reactString, performance} = initialData

      // Flush now if early-flush is disabled
      if (!req.app.locals.earlyFlush) {
        initialFlush(res)
      }

      const [criticalHTML, bodyHTML] = html.split('</head>')
      // The first html content has the be set after any possible call to next().
      // Otherwise some undesired/duplicated html could be attached to the error pages if an error occurs
      // no matter the error page strategy set (loadSPAOnNotFound: true|false)
      res.write(criticalHTML)
      res.flush()

      // res.set({
      //   'Server-Timing': `
      //   getInitialProps;desc=getInitialProps;dur=${performance.getInitialProps},
      //   renderToString;desc=renderToString;dur=${performance.renderToString}
      // `.replace(/\n/g, '')
      // })

      const helmet = Helmet.renderStatic()

      const {bodyAttributes, htmlAttributes, ...head} = helmet

      res.write(
        Object.keys(head)
          .map(section => head[section].toString())
          .join('')
      )
      res.flush()

      res.end(
        `</head>${bodyHTML}`
          .replace('<body>', `<body ${bodyAttributes.toString()}>`)
          .replace(APP_PLACEHOLDER, reactString)
          .replace(
            '</body>',
            `${injectDataHydration({
              windowPropertyName: '__APP_CONFIG__',
              data: req.appConfig
            })}
            ${injectDataHydration({
              windowPropertyName: '__INITIAL_PROPS__',
              data: initialProps
            })}</body>`
          )
          .replace('</body>', `${injectDataPerformance(performance)}</body>`)
      )
    }
  )
}
