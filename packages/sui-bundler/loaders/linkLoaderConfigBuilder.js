const path = require('path')
const LoaderUniversalOptionsPlugin = require('../plugins/loader-options')
const loadersOptions = require('../shared/loader-options')
const createSassLinkLoader = require('./sassLinkLoader')

const removePlugin = name => plugins => {
  const pos = plugins
    .map(p => p.constructor.toString())
    .findIndex(string => string.match(name))
  return [...plugins.slice(0, pos), ...plugins.slice(pos + 1)]
}

module.exports = ({config, packagesToLink}) => {
  if (packagesToLink.length === 0) {
    return config
  }

  console.log('🔗 Linking packages:')

  const entryPoints = packagesToLink.reduce((acc, pkg) => {
    const packagePath = path.resolve(pkg)
    try {
      const pkg = require(path.join(packagePath, 'package.json'))
      acc[pkg.name] = path.join(packagePath, 'src')
      console.log(`\t✅  ${pkg.name} from path "${packagePath}"`)
      return acc
    } catch (e) {
      console.log(
        `\t⚠️  Package from path "${packagePath}" can't be linked.\n  Path is wrong or package.json is missing.`
      )
      return acc
    }
  }, {})

  return {
    ...config,
    plugins: [
      ...removePlugin('LoaderUniversalOptionsPlugin')(config.plugins),
      new LoaderUniversalOptionsPlugin({
        ...loadersOptions,
        'sass-loader': {
          ...loadersOptions['sass-loader'],
          importer: [
            ...loadersOptions['sass-loader'].importer,
            createSassLinkLoader(entryPoints)
          ]
        }
      })
    ],
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.jsx?$/,
          use: {
            loader: 'link-loader',
            options: {
              entryPoints
            }
          }
        }
      ]
    },
    resolveLoader: {
      alias: {
        'link-loader': require.resolve('./LinkLoader')
      }
    }
  }
}
