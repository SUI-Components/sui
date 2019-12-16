const webpack = require('webpack')

const TARGET = process.env.npm_lifecycle_event
const CWD = process.cwd()

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['mocha'],

  reporters: ['spec'],

  browsers: ['Chrome'],

  webpack: {
    devtool: 'eval',
    mode: 'development',
    node: {
      fs: 'empty'
    },
    // webpack has the ability to generate path info in the output bundle.
    // However, this puts garbage collection pressure on projects that bundle thousands of modules.
    output: {
      pathinfo: false
    },
    plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
    // avoid unneded optimizations for running our tests in order to get fatest bundling time
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                cacheDirectory: true,
                presets: [
                  [
                    require.resolve('babel-preset-sui'),
                    {
                      isDevelopment: true
                    }
                  ]
                ],
                plugins: [require.resolve('babel-plugin-istanbul')]
              }
            }
          ]
        }
      ]
    }
  },

  client: {
    mocha: {
      reporter: 'html'
    }
  }
}

if (TARGET === 'test:ci') {
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

if (TARGET === 'test:watch') {
  config.reporters = ['clear-screen'].concat(config.reporters)
}

module.exports = config
