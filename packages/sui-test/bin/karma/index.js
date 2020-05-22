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

  const callback = code => {
    if (code === 0) return resolve()
    const err = Error(`Exit ${code}`)
    err.code = code
    reject(err)
  }

  const server = new Server(config, callback)

  server.completion = promise
  return server
}

module.exports = async ({
  watch,
  ci,
  pattern,
  ignorePattern,
  srcPattern,
  timeout
}) => {
  if (watch) configure.singleRun = false
  if (ci) configure.browsers = ['Firefox']
  if (ignorePattern) configure.exclude = [ignorePattern]

  configure.files = [
    `${CWD}/node_modules/@babel/polyfill/dist/polyfill.min.js`,
    srcPattern && `${CWD}/${srcPattern}`,
    `${CWD}/${pattern}`
  ].filter(Boolean)
  configure.preprocessors = {
    [pattern]: ['webpack'],
    ...(srcPattern && {[srcPattern]: ['webpack']})
  }

  configure.client.mocha = {
    ...configure.client.mocha,
    ...(timeout && {timeout})
  }

  const server = createServer(configure)

  server.start()

  // eslint-disable-next-line
  return await server.completion
}
