/* eslint no-console:0 */

const conventionalChangelog = require('conventional-changelog')
const config = require('./config')
const gitRawCommitsOpts = {reverse: true, topoOrder: true}

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
    {increment: 0, commits: []}
  )

const check = () =>
  new Promise((resolve, reject) => {
    const packagesWithChangelog = config.getScopes()

    let status = {}
    packagesWithChangelog.forEach(pkg => {
      status[pkg] = {
        increment: 0, // 0 = nothing, 1 = patch, 2 = minor, 3 = major
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

          var pkg = commit.scope
          var toPush = null

          if (
            commit.type === 'fix' ||
            commit.type === 'perf' ||
            commit.type === 'feat'
          ) {
            status[pkg].increment = Math.max(status[pkg].increment, 2)
            toPush = commit
          }

          if (isCommitBreakingChange(commit)) {
            status[pkg].increment = Math.max(status[pkg].increment, 3)
            toPush = commit
          }
          if (toPush) {
            status[pkg].commits.push(commit)
          }
          if (commit.type === 'release') {
            status[pkg].increment = 0
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
