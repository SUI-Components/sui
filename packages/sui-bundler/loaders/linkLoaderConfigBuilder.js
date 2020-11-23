const fg = require('fast-glob')
const path = require('path')

const log = require('../shared/log')
const {defaultAlias} = require('../shared/resolve-alias')

const diccFromAbsolutePaths = (paths, init = {}) =>
  paths.reduce((acc, pkg) => {
    const packagePath = path.resolve(pkg)
    try {
      const pkg = require(path.join(packagePath, 'package.json'))
      acc[pkg.name] = path.join(packagePath, 'src')
      log.success(`✔ ${pkg.name} from path "${packagePath}"`)
      return acc
    } catch (e) {
      log.warn(
        `⚠ Package from path "${packagePath}" can't be linked.\n  Path is wrong or package.json is missing.`
      )
      return acc
    }
  }, init)

const absolutePathForMonoRepo = base => {
  if (!base) return []
  return fg
    .sync([
      `${path.resolve(base)}/**/package.json`,
      '!**/node_modules/**',
      '!**/lib/**'
    ])
    .map(p => path.dirname(p))
}

module.exports = ({config, packagesToLink, linkAll}) => {
  if (packagesToLink.length === 0 && !linkAll) return config

  log.processing('❯ Linking packages:')

  const entryPoints = diccFromAbsolutePaths(
    packagesToLink || [],
    diccFromAbsolutePaths(absolutePathForMonoRepo(linkAll))
  )

  const linkLoader = {
    test: /\.(jsx?|scss)$/,
    use: {
      loader: require.resolve('./LinkLoader'),
      options: {
        entryPoints
      }
    }
  }

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        // we have to make sure we load default alias as we could be linking a package on production
        ...defaultAlias,
        ...config.resolve.alias
      }
    },
    module: {
      ...config.module,
      rules: [...config.module.rules, linkLoader]
    },
    resolveLoader: {
      alias: {
        ...config.resolveLoader.alias,
        'externals-manifest-loader': require.resolve(
          './ExternalsManifestLoader'
        )
      }
    }
  }
}
