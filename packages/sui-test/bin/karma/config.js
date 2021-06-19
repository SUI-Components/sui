const webpack = require('webpack')
const path = require('path')

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['mocha', 'webpack'],

  plugins: [
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-mocha',
    'karma-spec-reporter',
    'karma-webpack'
  ],

  reporters: ['spec'],

  browsers: ['Chrome'],

  browserDisconnectTolerance: 1,

  webpack: {
    devtool: 'eval',
    resolve: {
      alias: {
        '@s-ui/react-context': path.resolve(
          path.join(process.env.PWD, './node_modules/@s-ui/react-context')
        ),
        '*.scss$': false,
        '*.svg$': false
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
        zlib: false
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: require.resolve('process/browser')
      }),
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
                  require.resolve('babel-plugin-istanbul'),
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
    mocha: {
      reporter: 'html'
    }
  }
}

module.exports = config
