const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {WebpackPluginServe: Serve} = require('webpack-plugin-serve')

const definePlugin = require('./shared/define')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')
const {aliasFromConfig, defaultAlias} = require('./shared/resolve-alias')

const {envVars, MAIN_ENTRY_POINT, config, cleanList, when} = require('./shared')
const {resolveLoader} = require('./shared/resolve-loader')
const getPort = require('get-port')

const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}svg|${path.sep}studio)(${path.sep}workbench)?${path.sep}src)`
)
const host = process.env.HOST || '0.0.0.0'
const outputPath = path.join(process.cwd(), 'dist')

process.env.NODE_ENV = 'development'

const webpackConfig = {
  mode: 'development',
  context: path.resolve(process.env.PWD, 'src'),
  resolve: {
    alias: {
      ...defaultAlias,
      ...aliasFromConfig
    },
    fallback: {
      fs: false
    },
    extensions: ['.js', '.json']
  },
  entry: cleanList([
    MAIN_ENTRY_POINT,
    require.resolve('webpack-plugin-serve/client')
  ]),
  target: 'web',
  optimization: {
    emitOnErrors: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    runtimeChunk: true,
    splitChunks: false
  },
  output: {
    path: outputPath,
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
    }),
    new Serve({
      compress: true,
      historyFallback: true,
      host,
      hmr: false,
      liveReload: true,
      open: true,
      port: getPort({port: 3000}),
      static: [outputPath]
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
  watch: true,
  devtool:
    config.sourcemaps && config.sourcemaps.dev ? config.sourcemaps.dev : false
}

module.exports = webpackConfig
