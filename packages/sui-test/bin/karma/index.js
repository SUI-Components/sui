// https://github.com/developit/karmatic/blob/master/src/index.js
const {Server} = require('karma')
const config = require('./config')
const CWD = process.cwd()

module.exports = ({ci, pattern, ignorePattern, srcPattern, timeout, watch}) => {
  if (timeout) config.browserDisconnectTimeout = timeout
  if (ignorePattern) config.exclude = [ignorePattern]

  if (ci) {
    config.browsers = ['Firefox']
    config.reporters = ['coverage'].concat(config.reporters)
    config.preprocessors = {
      'src/**/*.js': ['coverage']
    }
    config.coverageReporter = {
      dir: `${CWD}/coverage`,
      reporters: [
        {type: 'cobertura', subdir: '.', file: 'coverage.xml'},
        {type: 'html', subdir: 'report-html'},
        {type: 'text-summary'}
      ]
    }
  }

  if (watch) {
    config.singleRun = false
    config.reporters = ['clear-screen'].concat(config.reporters)
  }

  config.files = [
    srcPattern ? `${CWD}/${srcPattern}` : '',
    {pattern: `${CWD}/${pattern}`, watch: false}
  ].filter(Boolean)

  console.log({pattern})
  console.log(config.files)

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
