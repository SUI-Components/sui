const path = require('path')
const LoaderUniversalOptionsPlugin = require('../plugins/loader-options')
const loadersOptions = require('../shared/loader-options')

module.exports = ({config, packagesToLink}) => {
  if (packagesToLink.length === 0) {
    return config
  }

  const removePlugin = name => plugins => {
    const pos = plugins
      .map(p => p.constructor.toString())
      .findIndex(string => string.match(name))
    return [...plugins.slice(0, pos), ...plugins.slice(pos + 1)]
  }

  const entryPoints = packagesToLink
    .map(p => path.resolve(p))
    .reduce((acc, packagePath) => {
      const pkg = require(path.join(packagePath, 'package.json'))
      acc[pkg.name] = path.join(packagePath, 'src')
      return acc
    }, {})

  const nextConfig = {
    ...config,
    plugins: [
      ...removePlugin('LoaderUniversalOptionsPlugin')(config.plugins),
      new LoaderUniversalOptionsPlugin({
        ...loadersOptions,
        'sass-loader': {
          ...loadersOptions['sass-loader'],
          importer: [
            ...loadersOptions['sass-loader'].importer,
            (url, prev) => {
              if (Object.keys(entryPoints).find(pkg => url.match(pkg))) {
                let [org, name] = url.split(/\//)
                const pkg = [org.replace('~', ''), name].join('/')

                const absoluteUrl = url.replace(
                  new RegExp(`~?${pkg}(\\/lib)?`, 'g'),
                  entryPoints[pkg]
                )
                return {file: absoluteUrl}
              }
              return null
            }
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
          // TODO: This is crappy, I need better options
          exclude: new RegExp(
            `node_modules(?!${path.sep}@s-ui(${path.sep}svg|${
              path.sep
            }studio)(${path.sep}workbench)?${path.sep}src)`
          ),
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
  return nextConfig
}
