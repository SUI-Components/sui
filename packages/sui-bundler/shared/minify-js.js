const {ESBuildMinifyPlugin} = require('esbuild-loader')

const esbuild = ({sourceMap}) =>
  new ESBuildMinifyPlugin({
    target: 'es6',
    sourcemap: sourceMap !== 'none' && sourceMap !== false
  })

module.exports = ({extractComments, sourceMap}) =>
  esbuild({extractComments, sourceMap})
