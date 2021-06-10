const webpack = require('webpack')
const path = require('path')

const config = {
  singleRun: true,

  basePath: '',

  frameworks: ['mocha'],

  reporters: ['spec'],

  browsers: ['Chrome'],

  browserDisconnectTolerance: 1,

  webpack: {
    devtool: 'eval',
    resolve: {
      alias: {
        '@s-ui/react-context': path.resolve(
          path.join(process.env.PWD, './node_modules/@s-ui/react-context')
        )
      },
      modules: [path.resolve(process.cwd()), 'node_modules'],
      extensions: ['.mjs', '.js', '.jsx', '.json']
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: require.resolve('process/browser')
      }),
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
          use: [require.resolve('null-loader')]
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
