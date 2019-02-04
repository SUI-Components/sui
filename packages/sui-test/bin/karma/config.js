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
          presets: ['babel-preset-sui'],
          plugins: [
            'babel-plugin-dynamic-import-node',
            '@babel/plugin-transform-modules-commonjs',
            TARGET === 'test:ci' && 'babel-plugin-istanbul'
          ].filter(Boolean)
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
  config.coverageReporter = {
    dir: `${CWD}/coverage`,
    reporters: [
      {type: 'cobertura', subdir: '.', file: 'coverage.xml'},
      {type: 'html', subdir: 'report-html'},
      {type: 'text-summary'}
    ]
  }
}

if (TARGET === 'test:watch') {
  config.reporters = ['clear-screen'].concat(config.reporters)
}

module.exports = config
