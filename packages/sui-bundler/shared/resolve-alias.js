const path = require('path')
const {config} = require('./config')

const {PWD} = process.env

/**
 * These alias are needed so React Hooks and React Context work as expected with linked packages.
 * Why? The reason is that hooks and context stores references.
 * So you should use the exact same imported file from node_modules, and the linked package
 * would try to use another different from its own node_modules. This will prevent that.
 */
const defaultPackagesToAlias = [
  'react',
  'react-router-dom',
  '@s-ui/react-context',
  '@s-ui/react-router'
]

const createAliasPath = pkgName =>
  path.resolve(path.join(PWD, `./node_modules/${pkgName}`))

exports.defaultAlias = Object.fromEntries(
  defaultPackagesToAlias.map(pkgName => [pkgName, createAliasPath(pkgName)])
)

exports.aliasFromConfig = config.alias
  ? Object.entries(config.alias).reduce(
      (obj, [aliasName, aliasPath]) => ({
        ...obj,
        [aliasName]: aliasPath.startsWith('./')
          ? path.join(PWD, aliasPath)
          : aliasPath
      }),
      {}
    )
  : {}
