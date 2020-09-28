const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LoaderUniversalOptionsPlugin = require('./plugins/loader-options')

const definePlugin = require('./shared/define')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')
const parseAlias = require('./shared/parse-alias')

const {envVars, MAIN_ENTRY_POINT, config, cleanList, when} = require('./shared')

const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}svg|${path.sep}studio)(${path.sep}workbench)?${path.sep}src)`
)

const webpackConfig = {
  mode: 'development',
  context: path.resolve(process.env.PWD, 'src'),
  resolve: {
    alias: {
      // this alias is needed so react hooks work as expected with linked packages
      // Why? The reason is that as hooks stores references of components
      // you should use the exact same imported file from node_modules, and the linked package
      // was trying to use another diferent from its own node_modules
      react: path.resolve(path.join(process.env.PWD, './node_modules/react')),
      '@s-ui/react-context': path.resolve(
        path.join(process.env.PWD, './node_modules/@s-ui/react-context')
      ),
      'react-router-dom': path.resolve(
        path.join(process.env.PWD, './node_modules/react-router-dom')
      ),
      '@s-ui/react-router': path.resolve(
        path.join(process.env.PWD, './node_modules/@s-ui/react-router')
      ),
      // add extra alias from the config
      ...parseAlias(config.alias)
    },
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: cleanList([
    require.resolve('react-dev-utils/webpackHotDevClient'),
    MAIN_ENTRY_POINT
  ]),
  target: 'web',
  node: {fs: 'empty'},
  output: {
    publicPath: '/'
  },
  plugins: [
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin({__DEV__: true}),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      env: process.env
    }),
    new LoaderUniversalOptionsPlugin(require('./shared/loader-options'))
  ],
  resolveLoader: {
    alias: {
      'externals-manifest-loader': require.resolve(
        './loaders/ExternalsManifestLoader'
      )
    }
  },
  module: {
    rules: cleanList([
      {
        test: /\.jsx?$/,
        exclude: EXCLUDED_FOLDERS_REGEXP,
        use: [
          {
            loader: require.resolve('thread-loader'),
            options: {
              poolTimeout: Infinity // keep workers alive for more effective watch mode
            }
          },
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              cacheDirectory: true,
              highlightCode: true,
              presets: [require.resolve('babel-preset-sui')]
            }
          }
        ]
      },
      {
        test: /(\.css|\.scss)$/,
        use: cleanList([
          'style-loader',
          when(config['externals-manifest'], () => ({
            loader: 'externals-manifest-loader',
            options: {
              manifestURL: config['externals-manifest']
            }
          })),
          'css-loader',
          'postcss-loader',
          'sass-loader'
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
