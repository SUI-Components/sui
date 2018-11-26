const {sep} = require('path')

module.exports = ({isServer = false} = {}) => ({
  test: /\.jsx?$/,
  exclude: new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`),
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: false,
      cacheDirectory: false,
      compact: true,
      presets: [
        require.resolve('babel-preset-sui'),
        isServer
          ? require.resolve('babel-plugin-dynamic-import-node').default
          : false
      ].filter(Boolean)
    }
  }
})
