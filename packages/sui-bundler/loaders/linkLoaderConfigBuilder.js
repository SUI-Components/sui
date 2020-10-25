const fg = require('fast-glob')
const path = require('path')

const createSassLinkLoader = require('./sassLinkLoader')
const log = require('../shared/log')

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
  if (!base) {
    return []
  }
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

  const sassLoaderWithLinkLoaderConfig = {
    loader: require.resolve('sass-loader'),
    options: {
      sassOptions: {
        importer: createSassLinkLoader(entryPoints)
      }
    }
  }

  const javascriptLinkLoader = {
    test: /\.jsx?$/,
    use: {
      loader: 'link-loader',
      options: {
        entryPoints
      }
    }
  }

  const newRules = config.module.rules.map(rule => {
    const {use: originalUseList} = rule
    const use = originalUseList.map(singleUse => {
      if (typeof singleUse === 'string' && singleUse.includes('sass-loader')) {
        return sassLoaderWithLinkLoaderConfig
      }
      return singleUse
    })
    return {...rule, use}
  })

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        ...(!config.resolve.alias.react && {
          react: path.resolve(
            path.join(process.env.PWD, './node_modules/react')
          )
        }),
        ...(!config.resolve.alias['@s-ui/react-context'] && {
          '@s-ui/react-context': path.resolve(
            path.join(process.env.PWD, './node_modules/@s-ui/react-context')
          )
        }),
        ...(!config.resolve.alias['react-router-dom'] && {
          'react-router-dom': path.resolve(
            path.join(process.env.PWD, './node_modules/react-router-dom')
          )
        }),
        ...(!config.resolve.alias['@s-ui/react-router'] && {
          '@s-ui/react-router': path.resolve(
            path.join(process.env.PWD, './node_modules/@s-ui/react-router')
          )
        })
      }
    },
    module: {
      ...config.module,
      rules: [...newRules, javascriptLinkLoader]
    },
    resolveLoader: {
      alias: {
        ...config.resolveLoader.alias,
        'link-loader': require.resolve('./LinkLoader'),
        'externals-manifest-loader': require.resolve(
          './ExternalsManifestLoader'
        )
      }
    }
  }
}
