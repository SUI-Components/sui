const path = require('path')
const {config} = require('./config.js')
const fs = require('fs')

const {PWD} = process.env

/**
 * These alias are needed so React Hooks and React Context work as expected with linked packages.
 * Why? The reason is that hooks and context stores references.
 * So you should use the exact same imported file from node_modules, and the linked package
 * would try to use another different from its own node_modules. This will prevent that.
 */
const defaultPackagesToAlias = [
  'react',
  'react-dom',
  'react-router-dom',
  'react/jsx-dev-runtime',
  'react/jsx-runtime',
  '@s-ui/pde',
  '@s-ui/react-context',
  '@s-ui/react-router'
]

const createAliasPath = pkgName => {
  const nodeModulesPath = path.join(PWD, './node_modules')
  const parentNodeModulesPath = path.join(PWD, '../node_modules')
  const pkgPath = nodeModulesPath && path.join(nodeModulesPath, pkgName)

  if (pkgPath && fs.existsSync(pkgPath)) {
    return path.resolve(pkgPath)
  } else if (fs.existsSync(parentNodeModulesPath)) {
    return path.resolve(path.join(parentNodeModulesPath, pkgName))
  }

  try {
    return require.resolve(pkgName).replace(/\/index\.js$/, '')
  } catch (e) {
    return ''
  }
}

const mustPackagesToAlias = {}

exports.defaultAlias = Object.fromEntries(
  defaultPackagesToAlias.map(pkgName => [pkgName, createAliasPath(pkgName)]).filter(([, path]) => path)
)

const aliasFromConfig = config.alias
  ? Object.entries(config.alias).reduce(
      (obj, [aliasName, aliasPath]) => ({
        ...obj,
        [aliasName]: aliasPath.startsWith('./') ? path.join(PWD, aliasPath) : aliasPath
      }),
      {}
    )
  : {}

exports.aliasFromConfig = {
  ...mustPackagesToAlias,
  ...aliasFromConfig
}
