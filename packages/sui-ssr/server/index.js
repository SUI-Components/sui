/* eslint no-console:0 */
import express from 'express'
import ssr from './middlewares/ssr.js'
import staticCriticalCss from './middlewares/criticalCss.js'
import {hooksFactory} from './hooksFactory/index.js'
import TYPES from '../hooks-types.js'
import basicAuth from 'express-basic-auth'
import compression from 'compression'
import ssrConf from './config.js'
import {
  isMultiSite,
  hostFromReq,
  useStaticsByHost,
  readHtmlTemplate
} from './utils/index.js'

import noOPConsole from 'noop-console'
noOPConsole(console)

if (process.env.CONSOLE) {
  console._restore()
}

const app = express()

app.set('x-powered-by', false)

// Read early-flush config.
// true: will flush before getInitialProps() was called favoring TTFB
// false: will flush after getInitialProps() was called
const EARLY_FLUSH_DEFAULT = true
app.locals.earlyFlush =
  typeof ssrConf.earlyFlush !== 'undefined'
    ? ssrConf.earlyFlush
    : EARLY_FLUSH_DEFAULT

const {PORT = 3000, AUTH_USERNAME, AUTH_PASSWORD} = process.env
const runningUnderAuth = AUTH_USERNAME && AUTH_PASSWORD
const AUTH_DEFINITION = {
  users: {[AUTH_USERNAME]: AUTH_PASSWORD},
  challenge: true
}
// Global object within the server context containing the
// cached HTML templates for each site.
const _memoizedHtmlTemplatesMapping = {}
;(async () => {
  const hooks = await hooksFactory()

  app.use(hooks[TYPES.BOOTSTRAP])
  app.use(hooks[TYPES.PRE_HEALTH])
  app.get('/_health', (req, res) =>
    res.status(200).json({uptime: process.uptime()})
  )

  app.use(compression())

  app.use(hooks[TYPES.ROUTE_MATCHING])
  app.use(hooks[TYPES.LOGGING])
  runningUnderAuth && app.use(basicAuth(AUTH_DEFINITION))
  app.use(express.static('statics'))

  app.use(hooks[TYPES.PRE_STATIC_PUBLIC])
  app.use(useStaticsByHost(express.static))

  app.use(hooks[TYPES.APP_CONFIG_SETUP])

  ssrConf.forceWWW &&
    app.use((req, res, next) => {
      const {hostname, subdomains} = req

      const isLocalhost =
        hostname.includes('localhost') || hostname.includes('.local')

      if (isLocalhost || subdomains.length) return next()

      res.redirect(`${req.protocol}://www.` + req.headers.host + req.url, 301)
    })

  app.use((req, res, next) => {
    // Since `_memoizedHtmlTemplatesMapping` will be always an object
    // we need to define a key for each multi site and one default
    // for single sites too.
    const site = isMultiSite ? hostFromReq(req) : 'default'
    const memoizedHtmlTemplate =
      _memoizedHtmlTemplatesMapping && _memoizedHtmlTemplatesMapping[site]

    if (memoizedHtmlTemplate) {
      req.htmlTemplate = memoizedHtmlTemplate
    } else {
      const htmlTemplate = readHtmlTemplate(req)
      req.htmlTemplate = htmlTemplate
      _memoizedHtmlTemplatesMapping[site] = htmlTemplate
    }

    next()
  })

  app.use(hooks[TYPES.SETUP_CONTEXT])

  app.use(hooks[TYPES.PRE_SSR_HANDLER])

  app.get('*', [staticCriticalCss, ssr])

  app.use(hooks[TYPES.NOT_FOUND])
  app.use(hooks[TYPES.INTERNAL_ERROR])

  app.listen(PORT, () =>
    console.log(`Server up & running 🌍 http://localhost:${PORT}`)
  ) // eslint-disable-line
})()
