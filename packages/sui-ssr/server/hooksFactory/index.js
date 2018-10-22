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
const __STATUS_PAGES__ = {}
const responsePageByStatus = async code => {
  if (__STATUS_PAGES__[code]) {
    return __STATUS_PAGES__[code]
  }

  const html = await promisify(readFile)(
    resolve(process.cwd(), 'public', `${code}.html`),
    'utf8'
  ).catch(e => `Generic Error Page: ${code}`)
  __STATUS_PAGES__[code] = html
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
      res.status(404).send(await responsePageByStatus(404))
    },
    [TYPES.INTERNAL_ERROR]: async (err, req, res, next) => {
      const status = err.status || 500
      res.status(status).send(await responsePageByStatus(status))
    },
    ..._userHooks
  }
}
