module.exports = {
  test: /\.jsx?$/,
  exclude: /node_modules(?!\/@s-ui\/studio\/src)/,
  loader: 'babel-loader',
  query: {
    babelrc: false,
    presets: ['sui']
  }
}
