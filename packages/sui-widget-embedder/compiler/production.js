const path = require('path')
const webpack = require('webpack')
const prodConfig = require('@s-ui/bundler/webpack.config.prod')

const MAIN_ENTRY_POINT = './index.js'

const pipe = (...funcs) => arg =>
  funcs.reduce((value, func) => func(value), arg)
const removePlugin = name => plugins => {
  const pos = plugins
    .map(p => p.constructor.toString())
    .findIndex(string => string.match(name))
  return [...plugins.slice(0, pos), ...plugins.slice(pos + 1)]
}

const requireOrDefault = path => {
  try {
    return require(path)
  } catch (e) {
    return {}
  }
}

module.exports = ({page, remoteCdn, globalConfig}) => {
  const config = requireOrDefault(
    path.resolve(process.cwd(), 'widgets', page, 'package')
  )

  const entry = {app: MAIN_ENTRY_POINT}
  if (config.vendor) {
    entry['vendor'] = config.vendor
  }
  return webpack({
    ...prodConfig,
    context: path.resolve(process.cwd(), 'widgets', page),
    resolve: {
      ...prodConfig.resolve,
      alias: globalConfig.alias
    },
    entry,
    output: {
      ...prodConfig.output,
      path: path.resolve(process.cwd(), 'public', page),
      publicPath: remoteCdn
        ? `${remoteCdn}/${page}/`
        : prodConfig.output.publicPath
    },
    plugins: pipe(
      removePlugin('HtmlWebpackPlugin'),
      removePlugin('ScriptExtHtmlWebpackPlugin'),
      removePlugin('PreloadWebpackPlugin')
    )(prodConfig.plugins)
  })
}
