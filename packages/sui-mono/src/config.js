import glob from 'glob'

import {getPackageJson} from '@s-ui/helpers/packages'

const CHANGELOG_FILENAME = 'CHANGELOG.md'
const CWD = process.cwd()
const packageFile = getPackageJson(CWD)

const _getWorkspaces = workspaces => {
  // If it is a monopackage, we return the current directory
  if (workspaces.length === 0) return ['.']
  // If we have more than one workspace, we join
  // folders with the pattern {components/**,demo/**,tests/**}/package.json
  const pattern = workspaces.length > 1 ? `{${workspaces.join()}}/package.json` : `${workspaces[0]}/package.json`

  const paths = glob.sync(pattern, {
    ignore: ['**/node_modules/**', './node_modules/**']
  })

  return paths.map(path => path.replace('/package.json', ''))
}

const _getPublishAccess = ({localPackageConfig = {}, packageConfig = {}}) => {
  const publishAccess =
    (localPackageConfig['sui-mono'] && localPackageConfig['sui-mono'].access) ||
    (packageConfig['sui-mono'] && packageConfig['sui-mono'].access) ||
    'restricted'

  return publishAccess
}

export function factoryConfigMethods(packageFile) {
  const {config: packageConfig = {}, name: packageName, workspaces = []} = packageFile

  return {
    checkIsMonoPackage: () => workspaces.length === 0,
    getChangelogFilename: () => CHANGELOG_FILENAME,
    getProjectName: () => packageName,
    getPublishAccess: ({localPackageConfig} = {}) => _getPublishAccess({localPackageConfig, packageConfig}),
    getOverrides: () => packageConfig['sui-mono']?.overrides ?? {},
    getWorkspaces: () => _getWorkspaces(workspaces)
  }
}

export const {checkIsMonoPackage, getChangelogFilename, getProjectName, getPublishAccess, getOverrides, getWorkspaces} =
  factoryConfigMethods(packageFile)
