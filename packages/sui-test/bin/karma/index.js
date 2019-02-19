// https://github.com/developit/karmatic/blob/master/src/index.js
const {Server} = require('karma')
const configure = require('./config')
const CWD = process.cwd()

const createServer = config => {
  let resolve, reject

  // eslint-disable-next-line
  let promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  let callback = code => {
    if (code === 0) return resolve()
    let err = Error(`Exit ${code}`)
    err.code = code
    reject(err)
  }

  let server = new Server(config, callback)

  server.completion = promise
  return server
}

module.exports = async ({watch, ci, pattern, ignorePattern, srcPattern}) => {
  if (watch) configure.singleRun = false
  if (ci) configure.browsers = ['Firefox']
  if (ignorePattern) configure.exclude = [ignorePattern]

  configure.files = [
    `${CWD}/node_modules/@babel/polyfill/dist/polyfill.min.js`,
    `${CWD}/${pattern}`
  ]
  configure.preprocessors = {
    [pattern]: ['webpack']
  }

  let server = createServer(configure)

  server.start()

  // eslint-disable-next-line
  return await server.completion
}
