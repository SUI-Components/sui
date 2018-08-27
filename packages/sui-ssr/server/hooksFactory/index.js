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

export default {
  [TYPES.LOGGING]: NULL_MDWL,
  [TYPES.NOT_FOUND]: async (req, res, next) => {
    res.status(404).send(await responsePageByStatus(404))
  },
  [TYPES.INTERNAL_ERROR]: async (err, req, res, next) => {
    const status = err.status || 500
    res.status(status).send(await responsePageByStatus(status))
  },
  ...(userHooks.default || userHooks)
}
