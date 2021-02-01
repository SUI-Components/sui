const path = require('path')
const {readdirSync, statSync} = require('fs')
const {getPackageJson} = require('@s-ui/helpers/packages')
const glob = require('glob')

const CWD = process.cwd()
const ROOT_SCOPE = 'Root'

const {
  config: packageConfig = {},
  name: packageName,
  workspaces
} = getPackageJson(CWD)

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
    if (workspaces) return this.getWorkspacesScopes()

    const folders = getDeepFolders(rootPath, deepLevel)

    const scopes = folders.map(
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
    if (workspaces) return this.getWorkspacesPaths()

    const packagesDir = path.join(CWD, this.getPackagesFolder())
    const scopes = singleScope ? [singleScope] : this.getScopes()
    return scopes
      .filter(scope => scope !== ROOT_SCOPE)
      .map(pkg => path.join(packagesDir, pkg))
  },
  getPackagesFolder: () => packagesFolder,
  getPublishAccess: () => publishAccess,
  getProjectName: () => packageName,
  getWorkspacesScopes: () => {
    const paths = this.getWorkspacesPaths()

    return paths.map(path => path.replace('/package.json', ''))
  },
  getWorkspacesPaths: () => {
    // {components/**,demo/**,tests/**}/package.json

    const pattern =
      workspaces.length > 1
        ? `{${workspaces.join()}}/package.json`
        : `${workspaces[0]}/package.json`

    console.log({pattern})

    const files = glob.sync(pattern, {
      ignore: ['**/node_modules/**', './node_modules/**']
    })
    console.log('------------')
    console.log(files)
    console.log('------------')
  },
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
