var TARGET = process.env.npm_lifecycle_event
var config = {

  basePath: '',

  frameworks: ['browserify', 'mocha'],

  files: [
    'node_modules/babel-polyfill/browser.js',
    'packages/*/test/**/*Spec.js'
  ],

  exclude: [
    'packages/*/test/server/*Spec.js'
  ],

  reporters: ['spec'],

  preprocessors: {
    'packages/*/test/**/*Spec.js': ['browserify']
  },

  browsers: ['Chrome'],

  // browserify configuration
  browserify: {
    debug: false,
    transform: [
      ['babelify', {
        presets: ['sui']
      }],
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
  config.browserify.transform = [require('browserify-babel-istanbul')].concat(config.browserify.transform)
  config.coverageReporter = {
    dir: './coverage',
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

module.exports = function (karma) {
  karma.set(config)
}
