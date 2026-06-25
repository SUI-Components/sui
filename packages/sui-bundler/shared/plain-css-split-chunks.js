const {config} = require('./index')

const cssInAppStyles = config.cssInAppStyles || []

exports.plainCssSplitChunks = () => {
  if (!cssInAppStyles.length) return {}

  const testRegex = new RegExp(
    `[\\\\/]node_modules[\\\\/](${cssInAppStyles.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})[\\\\/]`
  )

  return {
    splitChunks: {
      cacheGroups: {
        plainCssInEntry: {
          type: 'css/mini-extract',
          test: testRegex,
          name: 'AppStyles',
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
}
