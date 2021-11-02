const webpack = require('webpack')
const path = require('path')
const {clientConfig} = require('../../src/config')
const {sep} = require('path')
const {captureConsole = true} = clientConfig

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['mocha', 'webpack'],

  reporters: ['spec'],

  browsers: ['Chrome'],

  browserDisconnectTolerance: 1,

  webpackMiddleware: {
    stats: 'errors-only'
  },

  webpack: {
    stats: 'errors-only',
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
      fs: 'empty',
      child_process: 'empty',
      module: 'empty',
      readline: 'empty'
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'test' // use 'test' unless process.env.NODE_ENV is defined
      }),
      new webpack.DefinePlugin({
        __BASE_DIR__: JSON.stringify(process.env.PWD)
      })
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: new RegExp(
            `node_modules(?!${sep}@s-ui${sep}studio${sep}src)`
          ),
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
