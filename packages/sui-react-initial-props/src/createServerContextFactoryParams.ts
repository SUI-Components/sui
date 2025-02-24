import {type ContextFactoryParams} from './types'

export default (req: IncomingMessage.ServerRequest, res: IncomingMessage.ClientResponse): ContextFactoryParams => ({
  appConfig: req.appConfig,
  req,
  res,
  cookies: req.headers.cookie,
  isClient: false,
  // that's a native Express path, we might consider use another one instead
  pathName: req.path,
  userAgent: req.headers['user-agent']
})
