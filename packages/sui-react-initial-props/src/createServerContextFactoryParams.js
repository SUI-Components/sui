export default function createClientContextFactoryParams (req) {
  // we export the request as well in order to allow some customized params
  // for example, we might be using a req.uuid here for each request and want to use on the context
  return {
    req,
    cookies: req.headers.cookie,
    pathName: req.path, // that's a native Express path, we might consider use another one instead
    userAgent: req.headers['user-agent']
  }
}
