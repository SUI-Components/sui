import TerserPlugin from 'terser-webpack-plugin'

import {supportLegacyBrowsers} from './config.js'

const esbuildMinifier = ({sourceMap}) =>
  new TerserPlugin({
    minify: TerserPlugin.esbuildMinify,
    terserOptions: {
      target: 'es6',
      sourcemap: sourceMap !== 'none' && sourceMap !== false
    }
  })

const terserMinifier = ({extractComments, sourceMap}) =>
  new TerserPlugin({
    minify: TerserPlugin.terserMinify,
    extractComments,
    terserOptions: {
      ecma: 5,
      sourceMap: sourceMap !== 'none' && sourceMap !== false
    }
  })

export default ({extractComments, sourceMap}) =>
  supportLegacyBrowsers ? terserMinifier({extractComments, sourceMap}) : esbuildMinifier({sourceMap})
