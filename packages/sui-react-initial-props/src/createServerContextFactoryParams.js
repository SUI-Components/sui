export default req => ({
  appConfig: req.appConfig,
  req,
  cookies: req.headers.cookie,
  isClient: false,
  // that's a native Express path, we might consider use another one instead
  pathName: req.path,
  userAgent: req.headers['user-agent']
})
