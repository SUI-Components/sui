// https://github.com/developit/karmatic/blob/master/src/index.js
const {Server} = require('karma')
const config = require('./config')
const CWD = process.cwd()

module.exports = ({ci, pattern, ignorePattern, srcPattern, timeout, watch}) => {
  if (ci) config.browsers = ['Firefox']
  if (ignorePattern) config.exclude = [ignorePattern]
  if (watch) config.singleRun = false

  config.files = [
    `${CWD}/node_modules/@babel/polyfill/dist/polyfill.min.js`,
    srcPattern ? `${CWD}/${srcPattern}` : '',
    `${CWD}/${pattern}`
  ].filter(Boolean)
  config.preprocessors = {
    [pattern]: ['webpack'],
    ...(srcPattern && {[srcPattern]: ['webpack']})
  }

  config.client.mocha = {
    ...config.client.mocha,
    ...(timeout && {timeout})
  }

  return new Promise((resolve, reject) => {
    const server = new Server(config, code => {
      if (code === 0) return resolve()
      const err = new Error(`Exit ${code}`)
      err.code = code
      reject(err)
    })

    server.start()
  })
}
