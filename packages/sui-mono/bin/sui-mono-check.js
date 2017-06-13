/* eslint no-console:0 */
const checker = require('../src/check')

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
        if (checker.isCommitBreakingChange(commit)) {
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

checker.check().then(showReport)
