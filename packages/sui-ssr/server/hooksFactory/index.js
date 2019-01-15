import TYPES from '../../hooks-types'
import {readFile} from 'fs'
import {promisify} from 'util'
import {resolve} from 'path'

// __MAGIC IMPORTS__
// They came from {SPA}/src
// import userHooks from 'hooks'
let userHooks
try {
  userHooks = require('hooks')
} catch (e) {
  userHooks = {}
}
// END __MAGIC IMPORTS__

const isFunction = fnc => !!(fnc && fnc.constructor && fnc.call && fnc.apply)
const NULL_MDWL = (req, res, next) => next()
const INDEX_PAGE_NAME = 'index'
const __PAGES__ = {}
const NOT_FOUND_CODE = 404
const INTERNAL_ERROR_CODE = 500

const getPageContent = async pageName => {
  if (__PAGES__[pageName]) {
    return __PAGES__[pageName]
  }

  const html = await promisify(readFile)(
    resolve(process.cwd(), 'public', `${pageName}.html`),
    'utf8'
  ).catch(e => `Generic Error Page: ${pageName}`)
  __PAGES__[pageName] = html
  return html
}

// Build app config and attach it to the request.
const builAppConfig = (req, res, next) => {
  req.appConfig = {
    envs: req.app.locals.publicEnvConfig,
    hostname: req.hostname
  }
  next()
}

export const hooksFactory = async () => {
  const _userHooksInterOP = userHooks.default || userHooks
  const _userHooks = isFunction(_userHooksInterOP)
    ? await _userHooksInterOP()
    : _userHooksInterOP
  return {
    [TYPES.LOGGING]: NULL_MDWL,
    [TYPES.APP_CONFIG_SETUP]: builAppConfig,
    [TYPES.NOT_FOUND]: async (req, res, next) => {
      res.status(NOT_FOUND_CODE).send(await getPageContent(NOT_FOUND_CODE))
    },
    [TYPES.INTERNAL_ERROR]: async (err, req, res, next) => {
      // getInitialProps could throw a 404 error or any other error
      const status =
        err.message && err.message.includes(NOT_FOUND_CODE)
          ? NOT_FOUND_CODE
          : err.status || INTERNAL_ERROR_CODE

      // Prevents from trying to send headers twice (fatal error) when earlyFlush is enabled
      if (!res.headersSent) {
        res.status(status)
      }

      const pageName =
        req.app.locals.loadSPAOnNotFound && status === NOT_FOUND_CODE
          ? INDEX_PAGE_NAME
          : status

      res.end(await getPageContent(pageName))
    },
    ..._userHooks
  }
}
