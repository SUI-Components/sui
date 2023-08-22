/* eslint no-console:0 */

const conventionalChangelog = require('conventional-changelog')
const {readJsonSync} = require('fs-extra')

const {
  checkIsMonoPackage,
  getProjectName,
  getWorkspaces,
  getOverrides
} = require('./config.js')

const gitRawCommitsOpts = {reverse: true, topoOrder: true}

const PACKAGE_VERSION_INCREMENT = {
  NOTHING: 0,
  PATCH: 1,
  MINOR: 2,
  MAJOR: 3
}

const isCommitBreakingChange = commit => {
  const {body, footer} = commit

  return [body, footer].some(
    msg => typeof msg === 'string' && msg.includes('BREAKING CHANGE')
  )
}

const isCommitReleaseTrigger = commit => {
  const COMMIT_TYPES_WITH_RELEASE = ['fix', 'feat', 'perf', 'refactor']
  return COMMIT_TYPES_WITH_RELEASE.includes(commit.type)
}

const flattenForMonopackage = status =>
  checkIsMonoPackage() ? {[getProjectName()]: flatten(status)} : status

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
  (commit, cb) => {
    const {scope, header} = commit
    const [pkgToOverride] = getOverride({overrides, header}) ?? []
    const pkg = pkgToOverride ?? getPkgFromScope(scope)

    let toPush = null

    if (!packages.includes(pkg)) return cb()

    if (pkgToOverride) {
      status[pkgToOverride].increment = Math.max(
        status[pkgToOverride].increment,
        PACKAGE_VERSION_INCREMENT.MINOR
      )
      toPush = commit
    }

    if (isCommitReleaseTrigger(commit)) {
      status[pkg].increment = Math.max(
        status[pkg].increment,
        PACKAGE_VERSION_INCREMENT.MINOR
      )
      toPush = commit
    }

    if (isCommitBreakingChange(commit)) {
      status[pkg].increment = Math.max(
        status[pkg].increment,
        PACKAGE_VERSION_INCREMENT.MAJOR
      )
      toPush = commit
    }

    if (toPush) {
      status[pkg].commits.push(commit)
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
