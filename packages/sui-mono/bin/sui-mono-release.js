/* eslint no-console:0 */

const program = require('commander')
const path = require('path')
const config = require('../src/config')
const checker = require('../src/check')
const { serialSpawn } = require('@schibstedspain/sui-helpers/cli')

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Release your packages based on the version check output')
    console.log('')
    console.log('    Its adviced that you inspect the output on sui-mono check before releasing')
    console.log('    Release is the process of:')
    console.log('     - Build your projcet (with build or prepublish npm script')
    console.log('     - Updating package.json version')
    console.log('     - Creating a release commit type')
    console.log('     - Pushing the package to npm (in case its not private)')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-mono release')
    console.log('    $ sui-mono --help')
    console.log('    $ sui-mono -h')
    console.log('')
  })
  .parse(process.argv)

const BASE_DIR = process.cwd()

const packagesFolder = config.getPackagesFolder()
const publishAccess = config.getPublishAccess()
const suiMonoBinPath = require.resolve('@schibstedspain/sui-mono/bin/sui-mono')

const RELEASE_CODES = {
  0: 'clean',
  1: 'path',
  2: 'minor',
  3: 'major'
}

const releasesByPackages = () =>
  checker.check().then((status) =>
    Object.keys(status).map(scope => ({
      pkg: scope,
      code: status[scope].increment
    }))
  )

const releaseEachPkg = ({pkg, code} = {}) => {
  return new Promise((resolve, reject) => {
    if (code === 0) { return resolve() }

    const isMonoPackage = config.isMonoPackage()

    const tagPrefix = isMonoPackage
      ? ''
      : `${pkg}-`

    const packageScope = isMonoPackage
      ? 'META'
      : pkg

    const cwd = isMonoPackage
      ? BASE_DIR
      : path.join(BASE_DIR, packagesFolder, pkg)
    const pkgInfo = require(path.join(cwd, 'package.json'))
    const scripts = pkgInfo.scripts || {}

    let releaseCommands = [
      ['npm', ['--no-git-tag-version', 'version', `${RELEASE_CODES[code]}`]],
      ['git', ['add', cwd]],
      ['git', ['commit -m "release(' + packageScope + '): v$(node -p -e "require(\'./package.json\')".version)"']]
    ]
    let docCommands = [
      [suiMonoBinPath, ['changelog', cwd]],
      ['git', ['add', cwd]],
      ['git', ['commit --amend --no-verify --no-edit']]
    ]
    let publishCommands = [
      ['git', ['tag -a ' + tagPrefix + '$(node -p -e "require(\'./package.json\')".version) -m \"v$(node -p -e "require(\'./package.json\')".version)\"']], // eslint-disable-line no-useless-escape
      scripts['build'] && ['npm', ['run', 'build']],
      !pkgInfo.private && ['npm', ['publish', `--access=${publishAccess}`]],
      ['git', ['push', '--tags', 'origin', 'HEAD']]
    ].filter(Boolean)

    serialSpawn(releaseCommands, {cwd})
      .then(() => serialSpawn(docCommands))
      .then(() => serialSpawn(publishCommands, {cwd}))
      .then(resolve)
      .catch(reject)
  })
}

releasesByPackages()
       .then(releases =>
          releases
            .filter(({code}) => code !== 0)
            .map(release => () => releaseEachPkg(release))
            // https://gist.github.com/istarkov/a42b3bd1f2a9da393554
            .reduce((m, p) => m.then(v => Promise.all([...v, p()])), Promise.resolve([]))
        )
       .catch(console.log.bind(console))
