// @ts-check
import {createRequire} from 'module'
import path from 'path'

import webpack from 'webpack'

import {envVars} from '@s-ui/bundler/shared/index.js'
import {getSWCConfig} from '@s-ui/compiler-config'

import {bundlerConfig, clientConfig, isWorkspace} from '../../src/config.js'

const require = createRequire(import.meta.url)

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
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
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
        PATTERN: JSON.stringify(process.env.PATTERN),
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
          test: /\.tsx?$/,
          exclude: new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`),
          use: {
            loader: 'swc-loader',
            options: {
              sync: true,
              ...getSWCConfig({isModern: true, isTypeScript: true})
            }
          }
        },
        {
          test: /\.jsx?$/,
          exclude: new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`),
          use: {
            loader: 'swc-loader',
            options: {
              sync: true,
              ...getSWCConfig({isModern: true})
            }
          }
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

export default config
