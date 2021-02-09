/* eslint no-console:0 */
const program = require('commander')
const checker = require('../src/check')

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Reports if any package should be released based on ComVer')
    console.log('')
    console.log(
      '    It will create a MAJOR only if there are BREAKING CHANGES in the commit description'
    )
    console.log('    The types fix, perf and feat will generate a MINOR')
    console.log('    All other commit types will not generate a version change')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-mono check')
    console.log('    $ sui-mono --help')
    console.log('    $ sui-mono -h')
    console.log('')
  })
  .parse(process.argv)

const incrementName = code => {
  if (code === 1) return 'patch'
  if (code === 2) return 'minor'
  if (code === 3) return 'major'
  return ''
}

const showReportHeaderPositive = () => {
  console.log(
    'RELEASES TO DO\n\n' +
      'We checked all packages and recent commits, and discovered that\n' +
      'according to ComVer https://github.com/staltz/comver you should\n' +
      'release new versions for the following packages.\n'
  )
}

const showReportHeaderNegative = () => {
  console.log(
    'Nothing to release.\n\n' +
      'We checked all packages and recent commits, and discovered that\n' +
      'you do not need to release any new version, according to ComVer.'
  )
}

const showReport = status => {
  let headerShown = false
  for (const pkg in status) {
    if (status.hasOwnProperty(pkg) && status[pkg].increment > 0) {
      if (!headerShown) {
        showReportHeaderPositive()
        headerShown = true
      }

      const versionString = incrementName(status[pkg].increment).toUpperCase()
      console.log(
        `"${pkg}" needs a new ${versionString} version released because: `
      )

      status[pkg].commits.forEach(commit => {
        console.log('  . ' + commit.header)
        if (checker.isCommitBreakingChange(commit)) {
          console.log('    BREAKING CHANGE')
        }
      })
      console.log('')
    }
  }
  if (!headerShown) showReportHeaderNegative()
}

checker.check().then(showReport)
