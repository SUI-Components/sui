const path = require('path')
const readdirSync = require('fs').readdirSync
const statSync = require('fs').statSync
const argv = require('yargs').argv

const basePath = process.cwd()
const packageConfig = require(path.join(basePath, 'package.json')).config

function getOrDefault (key, defaultValue) {
  return (
    packageConfig &&
    packageConfig['sui-mono'] &&
    packageConfig['sui-mono'][key]
  ) || defaultValue
}

const packagesFolder = getOrDefault('packagesFolder', argv.packagesFolder || 'src')
const deepLevel = getOrDefault('deepLevel', argv.deepLevel || 1)
const customScopes = getOrDefault('customScopes', (argv.customScopes && argv.customScopes.split(',')) || [])
const publishAccess = getOrDefault('access', argv.access || 'private')

module.exports = {
  getScopes: function () {
    const folders = cwds(path.join(basePath, packagesFolder), deepLevel)
    const scopes = folders.map(folder => {
      const reversedPath = folder.split('/')
      const scope = Array.apply(null, Array(deepLevel)).map(Number.prototype.valueOf, 0)

      return scope.map(() => reversedPath.pop()).reverse().join('/')
    })

    return flatten(scopes, customScopes)
  },
  getPackagesFolder: function () {
    return packagesFolder
  },
  getPublishAccess: function () {
    return publishAccess
  }
}

const getFolders = (dir) => readdirSync(dir)
  .map(file => path.join(dir, file))
  .filter(onlyFolders)
const onlyFolders = (filePath) => statSync(filePath).isDirectory()
const flatten = (x, y) => x.concat(y)

const cwds = (rootDir, deep) => {
  const baseFolders = Array.apply(null, Array(deep)).map(Number.prototype.valueOf, 0)

  return baseFolders.reduce((acc) => {
    return acc.map(getFolders).reduce(flatten)
  }, [rootDir])
}
