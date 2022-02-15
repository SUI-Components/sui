const TerserPlugin = require('terser-webpack-plugin')

module.exports = ({extractComments, sourceMap}) =>
  new TerserPlugin({
    minify: TerserPlugin.esbuildMinify,
    terserOptions: {
      target: 'es5',
      sourcemap: sourceMap !== 'none' && sourceMap !== false
    }
  })
