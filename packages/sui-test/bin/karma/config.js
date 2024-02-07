// @ts-check

const webpack = require('webpack')
const path = require('path')
const {envVars} = require('@s-ui/bundler/shared/index.js')
const {bundlerConfig, clientConfig, isWorkspace} = require('../../src/config.js')

const {captureConsole = true} = clientConfig
const {sep} = path

/**
 *  Transform the env config (Array) to an object.
 *  Where the value is always an empty string.
 */
const environmentVariables = envVars(bundlerConfig.env)
const prefix = isWorkspace() ? '../' : './'
const pwd = process.env.PWD

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['mocha', 'webpack'],

  proxies: {
    '/mockServiceWorker.js': `/base/public/mockServiceWorker.js`
  },

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
        'react/jsx-dev-runtime': path.resolve(pwd, prefix, 'node_modules/react/jsx-dev-runtime.js'),
        'react/jsx-runtime': path.resolve(pwd, prefix, 'node_modules/react/jsx-runtime.js'),
        '@s-ui/react-context': path.resolve(path.join(pwd, prefix, 'node_modules/@s-ui/react-context'))
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
      new webpack.ProvidePlugin({
        process: require.resolve('process/browser')
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        ...environmentVariables
      }),
      new webpack.DefinePlugin({
        __MOCKS_API_PATH__: JSON.stringify(process.env.MOCKS_API_PATH || process.env.PWD + '/mocks/routes'),
        'process.env.SEED': JSON.stringify(process.env.SEED),
        __BASE_DIR__: JSON.stringify(process.env.PWD),
        PATTERN: JSON.stringify(process.env.PATTERN),
        CATEGORIES: JSON.stringify(process.env.CATEGORIES)
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
          exclude: new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`),
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
