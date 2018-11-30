const path = require('path')
const readdirSync = require('fs').readdirSync
const statSync = require('fs').statSync

const basePath = process.cwd()
const packageConfig = require(path.join(basePath, 'package.json')).config

function getOrDefault(key, defaultValue) {
  return (
    (packageConfig &&
      packageConfig['sui-mono'] &&
      packageConfig['sui-mono'][key]) ||
    defaultValue
  )
}

const packagesFolder = getOrDefault('packagesFolder', 'src')
const deepLevel = getOrDefault('deepLevel', 1)
const customScopes = getOrDefault('customScopes', [])
const rootPath = path.join(basePath, packagesFolder)

module.exports = {
  getScopes: function() {
    const folders = cwds(rootPath, deepLevel)
    const scopes = folders.map(folder => {
      const reversedPath = folder.split(path.sep)
      const scope = Array.apply(null, Array(deepLevel)).map(
        Number.prototype.valueOf,
        0
      )

      return scope
        .map(() => reversedPath.pop())
        .reverse()
        .join(path.sep)
    })

    return flatten(scopes, customScopes)
  },
  getPackagesFolder: function() {
    return packagesFolder
  },
  hasRootFiles: () =>
    Boolean(
      readdirSync(rootPath)
        .map(file => path.join(rootPath, file))
        .find(filePath => statSync(filePath).isFile())
    )
}

const getFolders = dir =>
  readdirSync(dir)
    .map(file => path.join(dir, file))
    .filter(onlyFolders)
const onlyFolders = filePath => statSync(filePath).isDirectory()
const flatten = (x, y) => x.concat(y)

const cwds = (rootDir, deep) => {
  const baseFolders = Array.apply(null, Array(deep)).map(
    Number.prototype.valueOf,
    0
  )

  return baseFolders.reduce(
    acc => {
      return acc.map(getFolders).reduce(flatten, [])
    },
    [rootDir]
  )
}
