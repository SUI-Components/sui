const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {cleanList, envVars, MAIN_ENTRY_POINT, config} = require('./shared/index.js')
const path = require('path')
const minifyJs = require('./shared/minify-js.js')
const definePlugin = require('./shared/define.js')
const createCompilerRules = require('./shared/module-rules-compiler.js')
const sassRules = require('./shared/module-rules-sass.js')
const {extractComments, sourceMap, supportLegacyBrowsers} = require('./shared/config.js')
const {aliasFromConfig} = require('./shared/resolve-alias.js')

module.exports = ({chunkCss} = {}) => {
  const chunkCssName = config.onlyHash ? '[contenthash:8].css' : '[name].[contenthash:8].css'
  const cssFileName = chunkCss ? chunkCssName : 'styles.css'
  return {
    mode: 'production',
    resolve: {
      alias: {
        ...aliasFromConfig
      },
      fallback: {
        assert: false,
        fs: false,
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        path: false
      },
      extensions: ['.js', '.tsx', '.ts', '.json'],
      modules: ['node_modules', path.resolve(process.cwd())]
    },
    entry: config.vendor
      ? {
          app: MAIN_ENTRY_POINT,
          vendor: config.vendor
        }
      : MAIN_ENTRY_POINT,
    target: 'web',
    output: {
      filename: 'index.js'
    },
    optimization: {
      // avoid looping over all the modules after the compilation
      checkWasmTypes: false,
      minimize: true,
      minimizer: [minifyJs({extractComments, sourceMap})]
    },
    plugins: cleanList([
      new webpack.ProvidePlugin({
        process: 'process/browser.js'
      }),
      new MiniCssExtractPlugin({
        filename: cssFileName,
        chunkFilename: cssFileName
      }),
      !chunkCss &&
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1
        }),
      new webpack.EnvironmentPlugin(envVars(config.env)),
      definePlugin()
    ]),
    module: {
      rules: [createCompilerRules({supportLegacyBrowsers}), sassRules]
    }
  }
}
