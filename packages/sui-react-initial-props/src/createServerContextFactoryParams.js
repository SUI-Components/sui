export default function createServerContextFactoryParams(req) {
  // we export the request as well in order to allow some customized params
  // for example, we might be using a req.uuid here for each request and want to use on the context
  return {
    appConfig: req.appConfig,
    req,
    cookies: req.headers.cookie,
    isClient: false,
    pathName: req.path, // that's a native Express path, we might consider use another one instead
    userAgent: req.headers['user-agent']
  }
}
