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
    mode: 'development',
    node: {
      fs: 'empty'
    },
    plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
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
                highlightCode: true,
                presets: [
                  [
                    require.resolve('babel-preset-sui'),
                    {
                      isDevelopment: true
                    }
                  ]
                ],
                plugins: [
                  require.resolve('babel-plugin-dynamic-import-node'),
                  require.resolve('@babel/plugin-proposal-export-default-from'),
                  require.resolve(
                    '@babel/plugin-proposal-export-namespace-from'
                  )
                ]
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
