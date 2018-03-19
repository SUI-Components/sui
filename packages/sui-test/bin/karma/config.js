const TARGET = process.env.npm_lifecycle_event
const CWD = process.cwd()

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['browserify', 'mocha'],

  reporters: ['spec'],

  browsers: ['Chrome'],

  // browserify configuration
  browserify: {
    debug: true,
    transform: [
      [
        'babelify',
        {
          presets: ['sui']
        }
      ],
      'envify'
    ]
  },

  client: {
    mocha: {
      reporter: 'html'
    }
  }
}

if (TARGET === 'test:ci') {
  config.reporters = ['coverage'].concat(config.reporters)
  config.browserify.transform = [require('browserify-babel-istanbul')].concat(
    config.browserify.transform
  )
  config.coverageReporter = {
    dir: `${CWD}/coverage`,
    reporters: [
      { type: 'cobertura', subdir: '.', file: 'coverage.xml' },
      { type: 'html', subdir: 'report-html' },
      { type: 'text-summary' }
    ]
  }
}

if (TARGET === 'test:watch') {
  config.reporters = ['clear-screen'].concat(config.reporters)
}

module.exports = config
