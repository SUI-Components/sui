// /* global __MOCKS_API_PATH__ */
import {rest} from 'msw'

import {getBrowserMocker} from './browser.js'
import {getServerMocker} from './server.js'

const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'

const setupMocker = isNode ? getServerMocker : getBrowserMocker

// TODO: Review error in Pipeline https://github.mpi-internal.com/scmspain/frontend-cf--web-app/actions/runs/3804318/job/12053812#step:5:238
// const generateHandlerFromContext = requester => {
//   const handlers = requester
//     .keys()
//     .filter(path => path.startsWith('./'))
//     .map(key => {
//       const module = requester(key)
//       return {
//         path: key,
//         ...(module.get && {get: module.get}),
//         ...(module.post && {post: module.post}),
//         ...(module.put && {put: module.put}),
//         ...(module.del && {delete: module.del}),
//         ...(module.patch && {patch: module.patch})
//       }
//     })
//     .map(descriptor => {
//       const {path, ...handlers} = descriptor
//       const url = path.replace('./', 'https://').replace('/index.js', '')
//       return Object.entries(handlers).map(([method, handler]) => {
//         return rest[method](url, async (req, res, ctx) => {
//           const body = ['POST', 'PATCH'].includes(req.method) ? await req.json() : '' // eslint-disable-line
//           const [status, json] = await handler({
//             headers: req.headers.all(),
//             params: req.params,
//             query: Object.fromEntries(req.url.searchParams),
//             cookies: req.cookies,
//             body
//           })
//           return res(ctx.status(status), ctx.json(json))
//         })
//       })
//     })
//     .flat(Infinity)
//   return handlers
// }

// const setupMocker = legacyHandlers => {
//   const mocker = isNode ? getServerMocker : getBrowserMocker
//   const apiContextRequest = false
//   // try {
//   //   apiContextRequest = require.context(__MOCKS_API_PATH__, true, /index\.js$/)
//   // } catch (err) {
//   //   console.error(`[sui-mock] Not found route folder in ${__MOCKS_API_PATH__} autoload of msw handlers disabled`)
//   //   apiContextRequest = false
//   // }
//
//   return mocker([...legacyHandlers, ...(apiContextRequest && generateHandlerFromContext(apiContextRequest))])
// }

export {setupMocker, rest}
