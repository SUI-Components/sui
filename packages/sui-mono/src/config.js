const path = require('path')
const {existsSync, readdirSync, statSync} = require('fs')
const {getPackageJson} = require('@s-ui/helpers/packages')

const CWD = process.cwd()
const ROOT_SCOPE = 'Root'

const {config: packageConfig = {}, name: packageName} = getPackageJson(CWD)
const {
  access: publishAccess = 'restricted',
  changelogFilename = 'CHANGELOG.md',
  customScopes: configCustomScopes = [],
  deepLevel = 1,
  packagesFolder = 'src'
} = packageConfig['sui-mono'] || {}

const rootPath = path.join(CWD, packagesFolder)

module.exports = {
  getScopes: function() {
    const folders = getDeepFolders(rootPath, deepLevel)

    const scopes = folders
      .filter(folder => existsSync(path.resolve(folder, 'package.json')))
      .map(
        folder =>
          folder // /User/project/components/detail/slider
            .split(path.sep) // ['', 'User', 'project', 'components', 'detail', 'slider']
            .slice(deepLevel * -1) // ['detail', 'slider']
            .join(path.sep) // 'detail/slider'
      )

    const customScopes =
      hasRootFiles() && this.isMonoPackage()
        ? [...configCustomScopes, ROOT_SCOPE]
        : configCustomScopes

    return [...scopes, ...customScopes]
  },
  getScopesPaths: function(singleScope) {
    const packagesDir = path.join(CWD, this.getPackagesFolder())
    const scopes = singleScope ? [singleScope] : this.getScopes()
    return scopes
      .filter(scope => scope !== ROOT_SCOPE)
      .map(pkg => path.join(packagesDir, pkg))
  },
  getPackagesFolder: () => packagesFolder,
  getPublishAccess: () => publishAccess,
  getProjectName: () => packageName,
  getChangelogFilename: () => changelogFilename,
  isMonoPackage: function() {
    const folders = getDeepFolders(rootPath, deepLevel)
    const pkgFolders = folders.filter(getPackageConfig)
    return !pkgFolders.length
  }
}

const getFolders = dir =>
  readdirSync(dir)
    .map(file => path.join(dir, file))
    .filter(onlyFolders)

const onlyFolders = filePath =>
  statSync(filePath).isDirectory() && !filePath.includes('node_modules')

const getDeepFolders = (rootDir, deep) => {
  return [...Array(deep)].reduce(
    currentFolders => currentFolders.flatMap(getFolders),
    [rootDir]
  )
}

const getPackageConfig = packagePath => getPackageJson(packagePath).name

const hasRootFiles = () =>
  Boolean(
    readdirSync(rootPath)
      .map(file => path.join(rootPath, file))
      .find(filePath => statSync(filePath).isFile())
  )
