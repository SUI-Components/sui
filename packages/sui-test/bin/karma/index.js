// https://github.com/developit/karmatic/blob/master/src/index.js
const {
  config: {parseConfig},
  Server
} = require('karma')
const config = require('./config.js')
const CWD = process.cwd()

module.exports = async ({
  ci,
  coverage,
  coverageInline,
  headless,
  ignorePattern,
  pattern,
  srcPattern,
  timeout,
  watch
}) => {
  if (timeout) config.browserDisconnectTimeout = timeout
  if (ignorePattern) config.exclude = [ignorePattern]

  /**
   * @deprecated - Use --headless instead
   */
  if (ci) {
    config.browsers = ['Firefox']
  }

  /**
   * We check the headless flag after the CI flag
   * so we use the Headless browser if it's present
   * instead Firefox
   */
  if (headless) {
    config.browsers = ['ChromeHeadless']
  }

  if (coverage || ci) {
    config.reporters = ['coverage'].concat(config.reporters)

    config.preprocessors = {
      'src/**/*.js': ['coverage']
    }
    config.coverageReporter = {
      dir: `${CWD}/coverage`,
      reporters: [
        {type: 'cobertura', subdir: '.', file: 'coverage.xml'},
        {type: 'html', subdir: 'report-html'},
        {type: 'json-summary', subdir: '.', file: 'coverage.json'},
        {
          type: 'text-summary',
          ...(!coverageInline && {
            subdir: '.',
            file: 'coverage.txt'
          })
        }
      ]
    }
  }

  if (watch) {
    config.singleRun = false
  }

  config.files = [
    srcPattern ? `${CWD}/${srcPattern}` : '',
    `${CWD}/${pattern}`,
    `${CWD}/public/mockServiceWorker.js`
  ].filter(Boolean)

  config.preprocessors = {
    ...config.preprocessors,
    [pattern]: ['webpack'],
    ...(srcPattern && {[srcPattern]: ['webpack']})
  }

  config.client.mocha = {
    ...config.client.mocha,
    ...(timeout && {timeout})
  }

  const karmaConfig = await parseConfig(null, config, {
    promiseConfig: true,
    throwErrors: true
  })

  return new Promise((resolve, reject) => {
    const server = new Server(karmaConfig, code => {
      if (code === 0) return resolve()
      const err = new Error(`Exit ${code}`)
      err.code = code
      reject(err)
    })

    server.start()
  })
}
