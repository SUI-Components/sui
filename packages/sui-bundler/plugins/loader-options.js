const path = require('path')

/**
 * Simple plugin that guarantees loaders to be loaded with the given options
 * in any context.
 * This fixes a bug of webpack that was loading files outside of context with
 * the given loaders, but not their options.
 *
 * @param {Object} [options={}] key = loader name, value = loader options
 */
function LoaderUniversalOptionsPlugin(options = {}) {
  this.loaderOptions = options
}

LoaderUniversalOptionsPlugin.prototype.apply = function(compiler, compilation) {
  var options = this.loaderOptions
  compiler.plugin('compilation', compilation => {
    compilation.plugin('normal-module-loader', (loaderContext, module) => {
      for (let idx in module.loaders) {
        let obj = module.loaders[idx]
        for (let pkg in options) {
          if (obj.loader.includes(`${path.sep}${pkg}${path.sep}`)) {
            obj.options = options[pkg]
            break
          }
        }
      }
    })
  })
}

module.exports = LoaderUniversalOptionsPlugin
