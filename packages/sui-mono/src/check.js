/* eslint no-console:0 */

const conventionalChangelog = require('./conventional-changelog.js')
const {readJsonSync} = require('fs-extra')

const {promisify} = require('util')

const {checkIsMonoPackage, getProjectName, getWorkspaces, getOverrides} = require('./config.js')

const exec = promisify(require('child_process').exec)
const gitRawCommitsOpts = {reverse: true, topoOrder: true}

const PACKAGE_VERSION_INCREMENT = {
  NOTHING: 0,
  PATCH: 1,
  MINOR: 2,
  MAJOR: 3
}
const DEPS_UPGRADE_COMMIT_TYPE = 'upgrade'
const DEPS_UPGRADE_COMMIT_TYPE_TO_PUSH = 'feat'
const DEPS_UPGRADE_PACKAGES = ['deps', 'deps-dev']
const DEPS_UPGRADE_BRANCH_PREFIX = 'dependabot/npm_and_yarn/'
const SCOPE_REGEX = /packages\/(([a-z]+)-?)+/ // matches "packages/sui-any-package-name"

const isCommitBreakingChange = commit => {
  const {body, footer} = commit

  return [body, footer].some(msg => typeof msg === 'string' && msg.includes('BREAKING CHANGE'))
}

const isCommitReleaseTrigger = commit => {
  const COMMIT_TYPES_WITH_RELEASE = ['fix', 'feat', 'perf', 'refactor']

  return COMMIT_TYPES_WITH_RELEASE.includes(commit.type)
}

const flattenForMonopackage = status => (checkIsMonoPackage() ? {[getProjectName()]: flatten(status)} : status)

const flatten = status =>
  Object.keys(status).reduce(
    (acc, scope) => {
      const scopeStatus = status[scope]

      acc.increment = Math.max(scopeStatus.increment, acc.increment)
      acc.commits = acc.commits.concat(scopeStatus.commits)

      return acc
    },
    {increment: PACKAGE_VERSION_INCREMENT.NOTHING, commits: []}
  )

const getPkgFromScope = scope => (scope === 'Root' ? '.' : scope)

const getOverride = ({overrides, header}) => {
  return Object.entries(overrides).find(([, configs]) => {
    return configs.find(({regex}) => header.match(new RegExp(regex)))
  })
}

const getTransform =
  ({status, packages, overrides = getOverrides()} = {}) =>
  async (commit, cb) => {
    const {scope, header, type, subject} = commit
    const [pkgToOverride] = getOverride({overrides, header}) ?? []
    const pkg = pkgToOverride ?? getPkgFromScope(scope)
    const isDepsUpgrade = type === DEPS_UPGRADE_COMMIT_TYPE && DEPS_UPGRADE_PACKAGES.includes(pkg)

    let toPush = null

    if (isDepsUpgrade) {
      const {stdout: rawUpgradeHash} = await exec(
        `git log --oneline --grep=${DEPS_UPGRADE_BRANCH_PREFIX} | awk '{print $1}' | head -n 1`
      )
      const upgradeHash = rawUpgradeHash.trim()

      if (!upgradeHash) return cb()

      const {stdout: rawParentHash} = await exec(`git rev-parse ${upgradeHash}^`)
      const parentHash = rawParentHash.trim()
      const {stdout: rawChangedFiles} = await exec(
        `git --no-pager diff --name-only ${upgradeHash} $(git merge-base ${parentHash} master)`
      )
      const changedFiles = rawChangedFiles.split('\n').filter(Boolean)
      const pkgsToUpdate = changedFiles.filter(file => file.match(SCOPE_REGEX)).map(file => file.match(SCOPE_REGEX)[0])

      if (!pkgsToUpdate?.length) return cb()

      pkgsToUpdate.forEach(pkg => {
        status[pkg].increment = Math.max(status[pkg].increment, PACKAGE_VERSION_INCREMENT.MINOR)
        status[pkg].commits = [
          {
            ...commit,
            header: `${DEPS_UPGRADE_COMMIT_TYPE_TO_PUSH}(${pkg}): ${subject}`
          }
        ]
      })
    }

    if (!packages.includes(pkg) && !isDepsUpgrade) {
      return cb()
    }

    if (pkgToOverride) {
      status[pkgToOverride].increment = Math.max(status[pkgToOverride].increment, PACKAGE_VERSION_INCREMENT.MINOR)
      toPush = commit
    }

    if (isCommitReleaseTrigger(commit)) {
      status[pkg].increment = Math.max(status[pkg].increment, PACKAGE_VERSION_INCREMENT.MINOR)
      toPush = commit
    }

    if (isCommitBreakingChange(commit)) {
      status[pkg].increment = Math.max(status[pkg].increment, PACKAGE_VERSION_INCREMENT.MAJOR)
      toPush = commit
    }

    if (toPush) {
      status[pkg].commits.push(toPush)
    }

    if (commit.type === 'release') {
      status[pkg].increment = PACKAGE_VERSION_INCREMENT.NOTHING
      status[pkg].commits = []
    }

    cb()
  }

const check = () =>
  new Promise(resolve => {
    /**
     * Remove packages with private field with true value
     * so we avoid them to be listed as releaseable
     */
    const packagesWithChangelog = getWorkspaces().filter(pkg => {
      const {private: privateField} = readJsonSync(`${pkg}/package.json`)

      return privateField !== true
    })
    const status = {}

    packagesWithChangelog.forEach(pkg => {
      status[pkg] = {
        increment: PACKAGE_VERSION_INCREMENT.NOTHING,
        commits: []
      }
    })

    conventionalChangelog(
      {
        preset: 'angular',
        append: true,
        transform: getTransform({status, packages: packagesWithChangelog})
      },
      {},
      gitRawCommitsOpts
    )
      .on('end', () => {
        resolve(flattenForMonopackage(status))
      })
      .resume()
  })

module.exports = {
  check,
  getTransform,
  isCommitBreakingChange,
  isCommitReleaseTrigger
}
