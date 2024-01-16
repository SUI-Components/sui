/* eslint no-console:0 */
const program = require('commander')
const colors = require('@s-ui/helpers/colors')
const checker = require('../src/check.js')

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Reports if any package should be released based on ComVer')
    console.log('')
    console.log('    It will create a MAJOR only if there are BREAKING CHANGES in the commit description')
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
  if (code === 1) return 'PATCH'
  if (code === 2) return 'MINOR'
  if (code === 3) return 'MAJOR'
  return ''
}

const showReportHeaderPositive = () => {
  console.log(colors.green('Releases to do:\n'))
}

const showReportHeaderNegative = () => {
  console.log(colors.yellow('Nothing to release according to your recent commits.'))
}

const showReport = status => {
  let headerShown = false

  for (const pkg in status) {
    if (status.hasOwnProperty(pkg) && status[pkg].increment > 0) {
      if (!headerShown) {
        showReportHeaderPositive()
        headerShown = true
      }

      const versionString = colors.yellow(incrementName(status[pkg].increment))
      const pkgName = colors.cyan(pkg)
      console.log(` ${pkgName} ─ new ${versionString} version: `)

      status[pkg].commits.forEach(commit => {
        const messagePrefix = checker.isCommitBreakingChange(commit) ? `> ${colors.red('BREAKING CHANGE')} -` : '>'

        console.log(`  ${messagePrefix} ${commit.header}\n`)
      })
    }
  }

  if (!headerShown) showReportHeaderNegative()
}

checker.check().then(showReport)
