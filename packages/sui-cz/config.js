const path = require('path')
const readdirSync = require('fs').readdirSync
const statSync = require('fs').statSync

const basePath = process.cwd()
const package = require(path.join(basePath, 'package.json'))

function getOrDefault(key, defaultValue) {
  return (
    package.config &&
    package.config['sui-mono'] &&
    package.config['sui-mono'][key]
  ) || defaultValue
}

const packagesFolder = getOrDefault('packagesFolder', 'src')
const deepLevel = getOrDefault('deepLevel', 1)
const customScopes = getOrDefault('customScopes', [])

module.exports = {
  getScopes: function() {
    const folders = cwds(path.join(basePath, packagesFolder), deepLevel)
    const scopes = folders.map(folder => {
      const reversedPath = folder.split('/')
      const scope = Array.apply(null, Array(deepLevel)).map(Number.prototype.valueOf,0)

      return scope.map(() => reversedPath.pop()).reverse().join('/')
    })

    return flatten(scopes, customScopes)
  },
  getPackagesFolder: function() {
    return packagesFolder
  }
}

const getFolders = (dir) => readdirSync(dir)
  .map(file => path.join(dir, file))
  .filter(onlyFolders)
const onlyFolders = (filePath) => statSync(filePath).isDirectory()
const flatten = (x, y) => x.concat(y)

const cwds = (rootDir, deep) => {
  const baseFolders = Array.apply(null, Array(deep)).map(Number.prototype.valueOf,0)

  return baseFolders.reduce((acc) => {
    return acc.map(getFolders).reduce(flatten)
  }, [rootDir])
}
