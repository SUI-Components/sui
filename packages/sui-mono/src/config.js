const path = require('path')
const readdirSync = require('fs').readdirSync
const statSync = require('fs').statSync

const basePath = process.cwd()
const projectPackage = require(path.join(basePath, 'package.json'))
const packageConfig = projectPackage.config
const ROOT_SCOPE = 'Root'

function getOrDefault(key, defaultValue) {
  return (
    (packageConfig &&
      packageConfig['sui-mono'] &&
      packageConfig['sui-mono'][key]) ||
    defaultValue
  )
}

const packagesFolder = getOrDefault('packagesFolder', 'src')
const rootPath = path.join(basePath, packagesFolder)
const deepLevel = getOrDefault('deepLevel', 1)
const configCustomScopes = getOrDefault('customScopes', [])
const publishAccess = getOrDefault('access', 'restricted')

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

    const customScopes =
      hasRootFiles() && this.isMonoPackage()
        ? [...configCustomScopes, ROOT_SCOPE]
        : configCustomScopes
    return flatten(scopes, customScopes)
  },
  getScopesPaths: function() {
    const packagesDir = path.join(process.cwd(), this.getPackagesFolder())
    return this.getScopes()
      .filter(scope => scope !== ROOT_SCOPE)
      .map(pkg => path.join(packagesDir, pkg))
  },
  getPackagesFolder: function() {
    return packagesFolder
  },
  getPublishAccess: function() {
    return publishAccess
  },
  getProjectName: function() {
    return projectPackage.name
  },
  isMonoPackage: function() {
    const folders = cwds(rootPath, deepLevel)
    const pkgFolders = folders.filter(getPackageConfig)
    return !pkgFolders.length
  }
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
      return acc.map(getFolders).reduce(flatten)
    },
    [rootDir]
  )
}

const getPackageConfig = packagePath => {
  try {
    return require(path.join(packagePath, 'package.json'))
  } catch (e) {
    return null
  }
}

const hasRootFiles = () =>
  Boolean(
    readdirSync(rootPath)
      .map(file => path.join(rootPath, file))
      .find(filePath => statSync(filePath).isFile())
  )
