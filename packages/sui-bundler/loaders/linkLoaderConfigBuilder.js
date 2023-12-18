const fg = require('fast-glob')
const path = require('path')

const log = require('../shared/log.js')
const {defaultAlias} = require('../shared/resolve-alias.js')
const createSassLinkImporter = require('./sassLinkImporter.js')

const diccFromAbsolutePaths = (paths, init = {}) =>
  paths.reduce((acc, pkg) => {
    const packagePath = path.resolve(pkg)
    try {
      const pkg = require(path.join(packagePath, 'package.json'))
      acc[pkg.name] = path.join(packagePath, 'src')
      log.success(`✔ ${pkg.name} from path "${packagePath}"`)
      return acc
    } catch (e) {
      log.warn(`⚠ Package from path "${packagePath}" can't be linked.\n  Path is wrong or package.json is missing.`)
      return acc
    }
  }, init)

const absolutePathForMonoRepo = base => {
  if (!base) return []
  return fg
    .sync([`${path.resolve(base)}/**/package.json`, '!**/node_modules/**', '!**/lib/**'])
    .map(p => path.dirname(p))
}

module.exports = ({config, packagesToLink, linkAll}) => {
  if (packagesToLink.length === 0 && !linkAll) return config

  log.processing('❯ Linking packages:')

  const entryPoints = diccFromAbsolutePaths(
    packagesToLink || [],
    diccFromAbsolutePaths(absolutePathForMonoRepo(linkAll))
  )

  /**
   * Create a loader config for javascript and css files that
   * are handled by Webpack. So when we try to load them
   * we check the entryPoints to change the source file
   * if neccesary
   */
  const linkLoader = {
    test: /\.(jsx?|tsx?|scss)$/,
    enforce: 'pre', // this will ensure is execute before transformations
    use: {
      loader: require.resolve('./LinkLoader'),
      options: {
        entryPoints
      }
    }
  }

  /**
   * Create a @s-ui/sass-loader config for scss files that
   * are handled by Sass. These are nested modules imported
   * and thus is sass binary which needs a special config for them.
   */
  const sassLoaderWithLinkImporter = {
    loader: require.resolve('@s-ui/sass-loader'),
    options: {
      sassOptions: {
        importer: createSassLinkImporter(entryPoints)
      }
    }
  }

  /**
   * Iterate over rules to change the previous sassLoader config
   * with the one with the importer created
   */
  const {rules} = config.module
  const rulesWithLink = rules.map(rule => {
    const {use, test: regex} = rule

    if (!use) return rule

    if (!regex.test('.css')) return rule

    return {
      ...rule,
      use: [...use.slice(0, -1), sassLoaderWithLinkImporter]
    }
  })

  /**
   * Return the new webpack config to be used
   * with all the needed changes for linking packages
   */
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
      rules: [...rulesWithLink, linkLoader]
    }
  }
}
