var TARGET = process.env.npm_lifecycle_event
var config = {

  basePath: '',

  frameworks: ['browserify', 'mocha'],

  files: [
    'node_modules/babel-polyfill/browser.js',
    'src/**/*.js',
    'test/browser/**/*Spec.js'
  ],

  reporters: ['spec'],

  preprocessors: {
    'test/browser/**/*.js': ['browserify'],
    'src/**/*.js': ['browserify']
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

if (TARGET === 'coverage') {
  config.reporters = ['coverage'].concat(config.reporters)
  config.browserify.transform = [require('browserify-babel-istanbul')].concat(config.browserify.transform)
  config.coverageReporter = {
    dir: 'coverage',
    reporters: [
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
