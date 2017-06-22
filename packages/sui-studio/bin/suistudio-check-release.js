/* eslint no-console:0 */

const conventionalChangelog = require('conventional-changelog')
const BASE_DIR = process.cwd()

const packagesWithChangelog = require('./walker').componentsName(BASE_DIR)

let status = {}
packagesWithChangelog.forEach((pkg) => {
  status[pkg] = {
    increment: 0, // 0 = nothing, 1 = patch, 2 = minor, 3 = major
    commits: []
  }
})

const incrementName = (code) => {
  if (code === 1) {
    return 'patch'
  } else if (code === 2) {
    return 'minor'
  } else if (code === 3) {
    return 'major'
  } else {
    return ''
  }
}

const isCommitBreakingChange = (commit) => {
  return (typeof commit.footer === 'string' &&
          commit.footer.indexOf('BREAKING CHANGE') !== -1)
}

const showReportHeaderPositive = () => {
  console.log(
    'RELEASES TO DO\n\n' +
    'We checked all packages and recent commits, and discovered that\n' +
    'according to ComVer https://github.com/staltz/comver you should\n' +
    'release new versions for the following packages.\n')
}

const showReportHeaderNegative = () => {
  console.log(
    'Nothing to release.\n\n' +
    'We checked all packages and recent commits, and discovered that\n' +
    'you do not need to release any new version, according to ComVer.')
}

const showReport = (status) => {
  var headerShown = false
  for (var pkg in status) {
    if (status.hasOwnProperty(pkg) && status[pkg].increment > 0) {
      if (!headerShown) {
        showReportHeaderPositive()
        headerShown = true
      }

      console.log('`' + pkg + '` needs a new ' +
        incrementName(status[pkg].increment).toUpperCase() +
        ' version released because:')
      status[pkg].commits.forEach(function (commit) {
        console.log('  . ' + commit.header)
        if (isCommitBreakingChange(commit)) {
          console.log('    BREAKING CHANGE')
        }
      })
      console.log('')
    }
  }
  if (!headerShown) {
    showReportHeaderNegative()
  }
}

conventionalChangelog({
  preset: 'angular',
  append: true,
  transform: (commit, cb) => {
    if (packagesWithChangelog.indexOf(commit.scope) === -1) {
      return cb()
    }

    var pkg = commit.scope
    var toPush = null

    if (commit.type === 'fix' || commit.type === 'perf' || commit.type === 'feat') {
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
}, {}, {reverse: true}).on('end', () => {
  // ORACLE mode
  var argPackage = process.argv[2]
  if (typeof argPackage === 'string' && argPackage.length > 0) {
    console.log({code: status[argPackage].increment})
    return process.exit(status[argPackage].increment)
  } else { // REPORT mode
    showReport(status)
  }
}).resume()
