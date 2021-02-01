/* eslint no-console:0 */

const conventionalChangelog = require('conventional-changelog')
const config = require('./config')
const gitRawCommitsOpts = {reverse: true, topoOrder: true}

const PACKAGE_VERSION_INCREMENT = {
  NOTHING: 0,
  PATCH: 1,
  MINOR: 2,
  MAJOR: 3
}

const isCommitBreakingChange = commit => {
  return (
    typeof commit.footer === 'string' &&
    commit.footer.indexOf('BREAKING CHANGE') !== -1
  )
}

const flattenForMonopackage = status => {
  return config.isMonoPackage()
    ? {[config.getProjectName()]: flatten(status)}
    : status
}

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

const check = () =>
  new Promise(resolve => {
    const packagesWithChangelog = config.getScopes()

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
        transform: (commit, cb) => {
          if (packagesWithChangelog.indexOf(commit.scope) === -1) {
            return cb()
          }

          const pkg = commit.scope
          let toPush = null

          if (
            commit.type === 'fix' ||
            commit.type === 'perf' ||
            commit.type === 'feat'
          ) {
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
  isCommitBreakingChange
}
