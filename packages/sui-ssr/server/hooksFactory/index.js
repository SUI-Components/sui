import {readFile} from 'fs'
import {resolve} from 'path'
import {promisify} from 'util'

// __MAGIC IMPORTS__
// They came from {SPA}/src
// import userHooks from 'hooks'
// this is not a dependency, it will import from project src/routes
import routes from 'routes'

import {createServerContextFactoryParams} from '@s-ui/react-initial-props'
import {match} from '@s-ui/react-router'

import TYPES from '../../hooks-types.js'
import {hrTimeToMs, publicFolder, siteByHost} from '../utils/index.js'
let userHooks
let contextFactory
try {
  // these are not dependencies, it will import from project src/hooks and src/routes
  userHooks = require('hooks')
  contextFactory = require('contextFactory').default
} catch (e) {
  userHooks = {}
  contextFactory = async () => ({})
}
// END __MAGIC IMPORTS__

const isFunction = fnc => !!(fnc && fnc.constructor && fnc.call && fnc.apply)
const NULL_MDWL = (req, res, next) => next()
const __PAGES__ = {}
const NOT_FOUND_CODE = 404
const INTERNAL_ERROR_CODE = 500

const getStaticErrorPageContent = async (status, req) => {
  if (__PAGES__[status]) {
    return __PAGES__[status]
  }
  const html = await promisify(readFile)(resolve(process.cwd(), publicFolder(req), `${status}.html`), 'utf8').catch(
    () => `Generic Error Page: ${status}`
  )
  __PAGES__[status] = html
  return html
}

// Build app config and attach it to the request.
const builAppConfig = (req, res, next) => {
  req.appConfig = {
    hostname: req.hostname
  }
  next()
}

export const hooksFactory = async () => {
  const _userHooksInterOP = userHooks.default || userHooks
  const _userHooks = isFunction(_userHooksInterOP) ? await _userHooksInterOP() : _userHooksInterOP

  return {
    [TYPES.PRE_HEALTH]: NULL_MDWL,
    [TYPES.BOOTSTRAP]: (req, res, next) => {
      req.performance = {}

      return next()
    },
    [TYPES.ROUTE_MATCHING]: async (req, res, next) => {
      const startRouteMatchingTime = process.hrtime()
      const {performance = {}, url} = req
      const site = siteByHost(req)
      const siteRoutes = site && isFunction(routes) ? routes({site}) : routes

      match[promisify.custom] = args =>
        new Promise((resolve, reject) => {
          match(args, (error, redirectLocation, renderProps) => {
            if (error) {
              reject(error)
            }

            resolve({redirectLocation, renderProps})
          })
        })

      if (!siteRoutes) {
        console.error('Required routes file missing') // eslint-disable-line no-console
        process.exit(1)
      }

      try {
        const {redirectLocation, renderProps} = await promisify(match)({
          routes: siteRoutes,
          location: url
        })

        req.matchResult = {
          redirectLocation,
          renderProps
        }
      } catch (error) {
        req.matchResult = {
          error
        }

        return next(error)
      }

      const diffRouteMatchingTime = process.hrtime(startRouteMatchingTime)

      req.performance = {
        ...performance,
        matchRoutes: hrTimeToMs(diffRouteMatchingTime)
      }

      return next()
    },
    [TYPES.LOGGING]: NULL_MDWL,
    [TYPES.CSP_REPORT]: (req, res) => res.status(200).json({message: 'Tracking disabled'}),
    [TYPES.PRE_STATIC_PUBLIC]: NULL_MDWL,
    [TYPES.SETUP_CONTEXT]: async (req, res, next) => {
      const startContextCreationTime = process.hrtime()
      const {performance = {}} = req

      req.context = await contextFactory(createServerContextFactoryParams(req))

      const diffContextCreationTime = process.hrtime(startContextCreationTime)

      req.performance = {
        ...performance,
        contextCreation: hrTimeToMs(diffContextCreationTime)
      }

      return next()
    },
    [TYPES.PRE_SSR_HANDLER]: NULL_MDWL,
    [TYPES.APP_CONFIG_SETUP]: builAppConfig,
    [TYPES.NOT_FOUND]: async (req, res) => {
      res.status(NOT_FOUND_CODE).send(await getStaticErrorPageContent(NOT_FOUND_CODE, req))
    },
    [TYPES.INTERNAL_ERROR]: async (err, req, res, next) => {
      // getInitialProps could throw a 404 error or any other error
      req.log && req.log.error && req.log.error((' ' + err.message).slice(1))
      const status =
        err.message && err.message.includes(NOT_FOUND_CODE) ? NOT_FOUND_CODE : err.status || INTERNAL_ERROR_CODE

      // Prevents from trying to send headers twice (fatal error) when earlyFlush is enabled
      if (!res.headersSent) {
        res.status(status)
      }

      res.send(await getStaticErrorPageContent(status, req))
    },
    ..._userHooks
  }
}
