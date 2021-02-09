const {getPackageJson} = require('@s-ui/helpers/packages')
const glob = require('glob')

const CWD = process.cwd()

const {
  config: packageConfig = {},
  name: packageName,
  workspaces = []
} = getPackageJson(CWD)

const {
  access: publishAccess = 'restricted',
  changelogFilename = 'CHANGELOG.md'
} = packageConfig['sui-mono'] || {}

const getWorkspaces = () => {
  /**
   * If we have more than one worspace, we join
   * folders with the pattern {components/**,demo/**,tests/**}/package.json
   */
  const pattern =
    workspaces.length > 1
      ? `{${workspaces.join()}}/package.json`
      : `${workspaces[0]}/package.json`

  const paths = glob.sync(pattern, {
    ignore: ['**/node_modules/**', './node_modules/**']
  })

  return paths.map(path => path.replace('/package.json', ''))
}

module.exports = {
  checkIsMonoPackage: () => workspaces.length === 0,
  getChangelogFilename: () => changelogFilename,
  getProjectName: () => packageName,
  getPublishAccess: () => publishAccess,
  getWorkspaces

  // getScopes: () => getWorkspacesScopes(),
  // getWorkspacesPaths,
  // getWorkspacesScopes
}
