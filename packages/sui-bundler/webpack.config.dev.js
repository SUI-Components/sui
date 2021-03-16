const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const definePlugin = require('./shared/define')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')
const {aliasFromConfig, defaultAlias} = require('./shared/resolve-alias')

const {envVars, MAIN_ENTRY_POINT, config, cleanList, when} = require('./shared')
const {resolveLoader} = require('./shared/resolve-loader')

const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}svg|${path.sep}studio)(${path.sep}workbench)?${path.sep}src)`
)

const webpackConfig = {
  mode: 'development',
  context: path.resolve(process.env.PWD, 'src'),
  resolve: {
    alias: {
      ...defaultAlias,
      ...aliasFromConfig
    },
    extensions: ['.js', '.json']
  },
  entry: cleanList([
    require.resolve('react-dev-utils/webpackHotDevClient'),
    MAIN_ENTRY_POINT
  ]),
  target: 'web',
  node: {fs: 'empty'},
  optimization: {
    noEmitOnErrors: true,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    runtimeChunk: true,
    splitChunks: false
  },
  output: {
    pathinfo: false,
    publicPath: '/'
  },
  plugins: [
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin({__DEV__: true}),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      env: process.env
    })
  ],
  resolveLoader,
  module: {
    rules: cleanList([
      {
        test: /\.jsx?$/,
        exclude: EXCLUDED_FOLDERS_REGEXP,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              cacheDirectory: true,
              presets: [require.resolve('babel-preset-sui')]
            }
          }
        ]
      },
      {
        test: /(\.css|\.scss)$/,
        use: cleanList([
          require.resolve('style-loader'),
          when(config['externals-manifest'], () => ({
            loader: 'externals-manifest-loader',
            options: {
              manifestURL: config['externals-manifest']
            }
          })),
          require.resolve('css-loader'),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')({
                    overrideBrowserslist: config.targets
                  })
                ]
              }
            }
          },
          require.resolve('sass-loader')
        ])
      },
      when(config['externals-manifest'], () =>
        manifestLoaderRules(config['externals-manifest'])
      )
    ])
  },
  devtool:
    config.sourcemaps && config.sourcemaps.dev ? config.sourcemaps.dev : 'none'
}

module.exports = webpackConfig
