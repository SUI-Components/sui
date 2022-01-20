// @ts-check

const webpack = require('webpack')
const path = require('path')
const {envVars} = require('@s-ui/bundler/shared/index.js')
const {bundlerConfig, clientConfig} = require('../../src/config.js')

const {captureConsole = true} = clientConfig
const {sep} = path

/**
 *  Transform the env config (Array) to an object.
 *  Where the value is always an empty string.
 */
const environmentVariables = envVars(bundlerConfig.env)

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['mocha', 'webpack'],

  plugins: [
    require.resolve('karma-webpack'),
    require.resolve('karma-chrome-launcher'),
    require.resolve('karma-firefox-launcher'),
    require.resolve('karma-mocha'),
    require.resolve('karma-coverage'),
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
        assert: false,
        child_process: false,
        constants: false,
        crypto: false,
        fs: false,
        http: false,
        https: false,
        module: false,
        os: false,
        path: false,
        readline: false,
        stream: require.resolve('stream-browserify'),
        timers: false,
        tty: false,
        util: require.resolve('util/'),
        vm: false,
        worker_threads: false,
        zlib: false
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __BASE_DIR__: JSON.stringify(process.env.PWD),
        CATEGORIES: JSON.stringify(process.env.CATEGORIES)
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        ...environmentVariables
      }),
      new webpack.ProvidePlugin({
        process: require.resolve('process/browser')
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
