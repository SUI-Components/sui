const webpack = require('webpack')
const path = require('path')
const {clientConfig} = require('../../src/config')

const {captureConsole = true} = clientConfig

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['mocha'],

  reporters: ['spec'],

  browsers: ['Chrome'],

  browserDisconnectTolerance: 1,

  webpack: {
    devtool: 'eval',
    mode: 'development',
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
    // webpack has the ability to generate path info in the output bundle.
    // However, this puts garbage collection pressure on projects that bundle thousands of modules.
    output: {
      pathinfo: false
    },
    plugins: [
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new webpack.DefinePlugin({
        __BASE_DIR__: JSON.stringify(process.env.PWD)
      })
    ],
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
                  require.resolve('babel-plugin-istanbul'),
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
