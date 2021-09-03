const webpack = require('webpack')
const path = require('path')
const {clientConfig} = require('../../src/config')

const {captureConsole = true} = clientConfig

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['mocha', 'webpack'],

  reporters: ['spec'],

  browsers: ['Chrome'],

  browserDisconnectTolerance: 1,

  webpackMiddleware: {
    stats: {
      all: false,
      errors: true,
      timings: true
    }
  },

  webpack: {
    stats: 'minimal',
    resolve: {
      alias: {
        '@s-ui/react-context': path.resolve(
          path.join(process.env.PWD, './node_modules/@s-ui/react-context')
        )
      },
      modules: [path.resolve(process.cwd()), 'node_modules'],
      extensions: ['.mjs', '.js', '.jsx', '.json']
    },
    node: {
      fs: 'empty'
    },
    plugins: [
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new webpack.DefinePlugin({
        __BASE_DIR__: JSON.stringify(process.env.PWD)
      })
    ],
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
                sourceType: 'unambiguous',
                presets: [
                  [
                    require.resolve('babel-preset-sui'),
                    {
                      isDevelopment: true
                    }
                  ]
                ],
                plugins: [
                  [
                    require.resolve('babel-plugin-istanbul'),
                    {
                      exclude: ['**/lib/**/*.js', '**/test/**/*.js']
                    }
                  ],
                  require.resolve('./babelPatch.js')
                ]
              }
            }
          ]
        },
        {
          // ignore css/scss require/imports files in the server
          test: [/\.s?css$/, /\.svg$/],
          use: ['null-loader']
        }
      ]
    }
  },

  client: {
    captureConsole,
    mocha: {
      reporter: 'html'
    }
  }
}

module.exports = config
