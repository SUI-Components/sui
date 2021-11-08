const webpack = require('webpack')
const path = require('path')

const {clientConfig} = require('../../src/config')

const {captureConsole = true} = clientConfig
const {sep} = path

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['mocha', 'webpack'],

  plugins: [
    require.resolve('karma-webpack'),
    require.resolve('karma-chrome-launcher'),
    require.resolve('karma-firefox-launcher'),
    require.resolve('karma-mocha'),
    require.resolve('karma-spec-reporter')
  ],

  reporters: ['spec'],

  browsers: ['Chrome'],

  browserDisconnectTolerance: 1,

  webpackMiddleware: {
    stats: 'errors-only'
  },

  webpack: {
    devtool: 'eval',
    stats: 'errors-only',
    resolve: {
      alias: {
        '@s-ui/react-context': path.resolve(
          path.join(process.env.PWD, './node_modules/@s-ui/react-context')
        )
      },
      modules: [path.resolve(process.cwd()), 'node_modules'],
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      fallback: {
        child_process: false,
        constants: false,
        fs: false,
        os: false,
        module: false,
        stream: false,
        http: false,
        https: false,
        path: false,
        timers: false,
        readline: false,
        zlib: false
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: require.resolve('process/browser')
      }),
      new webpack.DefinePlugin({
        __BASE_DIR__: JSON.stringify(process.env.PWD),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'test')
      })
    ],
    module: {
      rules: [
        {
          test: [/\.s?css$/, /\.svg$/],
          type: 'asset/inline',
          generator: {
            dataUrl: () => ''
          }
        },
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