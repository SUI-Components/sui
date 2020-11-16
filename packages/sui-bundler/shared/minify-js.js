const TerserPlugin = require('terser-webpack-plugin')
const {CI = false} = process.env
const CI_PARALLEL_CORES = 2

module.exports = ({extractComments, sourceMap}) =>
  new TerserPlugin({
    extractComments,
    terserOptions: {
      parse: {
        // we want terser to parse ecma 8 code. However, we don't want it
        // to apply any minfication steps that turns valid ecma 5 code
        // into invalid ecma 5 code. This is why the 'compress' and 'output'
        // sections only apply transformations that are ecma 5 safe
        // https://github.com/facebook/create-react-app/pull/4234
        ecma: 8
      },
      compress: {
        ecma: 5,
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebook/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
        // Disabled because of an issue with Terser breaking valid code:
        // https://github.com/facebook/create-react-app/issues/5250
        // Pending futher investigation:
        // https://github.com/terser-js/terser/issues/120
        inline: 2
      },
      mangle: {
        safari10: true
      },
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true
      }
    },
    // Use multi-process parallel running to improve the build speed
    // For CI: Use only fixed cores as it gives incorrect info and could cause troubles
    // Related: https://github.com/webpack-contrib/terser-webpack-plugin/issues/202
    // If not CI then use os.cpus().length - 1
    parallel: CI ? CI_PARALLEL_CORES : true,
    // Enable file caching
    cache: true,
    // use sourceMap if parameter is provided
    sourceMap: !!sourceMap
  })
