const {config} = require('./index')

const cssInAppStyles = config.cssInAppStyles || []

exports.plainCssSplitChunks = () => {
  if (!cssInAppStyles.length) return {}

  return {
    plugins: [
      {
        apply(compiler) {
          const pkgPattern = cssInAppStyles.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
          const pkgRegex = new RegExp(`[\\\\/]node_modules[\\\\/](${pkgPattern})[\\\\/]`)

          compiler.hooks.thisCompilation.tap('CssInAppStyles', compilation => {
            compilation.hooks.afterOptimizeChunks.tap('CssInAppStyles', chunks => {
              let appStylesChunk = null
              for (const chunk of chunks) {
                if (chunk.name === 'AppStyles') {
                  appStylesChunk = chunk
                  break
                }
              }
              if (!appStylesChunk) return

              for (const chunk of chunks) {
                if (chunk === appStylesChunk) continue
                const modulesToMove = []
                for (const module of compilation.chunkGraph.getChunkModulesIterable(chunk)) {
                  if (module.type !== 'css/mini-extract') continue
                  const name = module.nameForCondition && module.nameForCondition()
                  if (name && pkgRegex.test(name)) {
                    modulesToMove.push(module)
                  }
                }
                for (const module of modulesToMove) {
                  compilation.chunkGraph.disconnectChunkAndModule(chunk, module)
                  if (!compilation.chunkGraph.isModuleInChunk(module, appStylesChunk)) {
                    compilation.chunkGraph.connectChunkAndModule(appStylesChunk, module)
                  }
                }
              }
            })
          })
        }
      }
    ]
  }
}
