/* eslint no-console:0 */
require('util.promisify/shim')()
const program = require('commander')
const path = require('path')
const config = require('../src/config')
const checker = require('../src/check')
const {serialSpawn, showError} = require('@s-ui/helpers/cli')
const {getPackageJson} = require('@s-ui/helpers/packages')
const {exec: execNative} = require('child_process')
const util = require('util')
const exec = util.promisify(execNative)

program
  .option('-S, --scope <scope>', 'release a single scope')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Release your packages based on the version check output')
    console.log('')
    console.log(
      '    Its adviced that you inspect the output on sui-mono check before releasing'
    )
    console.log('    Release is the process of:')
    console.log(
      '     - Build your project (with build or prepublish npm script)'
    )
    console.log('     - Updating package.json version')
    console.log('     - Creating a release commit type')
    console.log('     - Pushing the package to npm (in case its not private)')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-mono release')
    console.log('    $ sui-mono release --scope packages/sui-test')
    console.log('    $ sui-mono --help')
    console.log('    $ sui-mono -h')
    console.log('')
  })
  .parse(process.argv)

const BASE_DIR = process.cwd()
const packagesFolder = config.getPackagesFolder()
const publishAccess = config.getPublishAccess()
const suiMonoBinPath = require.resolve('@s-ui/mono/bin/sui-mono')

const RELEASE_CODES = {
  0: 'clean',
  1: 'path',
  2: 'minor',
  3: 'major'
}

const scopeMapper = ({scope, status}) => ({
  pkg: scope,
  code: status[scope].increment
})

const releasesByPackages = ({status}) =>
  Object.keys(status).map(scope => scopeMapper({scope, status}))

const singlePackageRelease = ({status, packageScope}) =>
  Object.keys(status)
    .filter(scope => scope === packageScope)
    .map(scope => scopeMapper({scope, status}))

const releaseEachPkg = ({pkg, code} = {}) => {
  return new Promise((resolve, reject) => {
    if (code === 0) {
      return resolve()
    }

    const isMonoPackage = config.isMonoPackage()

    const tagPrefix = isMonoPackage ? '' : `${pkg}-`

    const packageScope = isMonoPackage ? 'META' : pkg.replace(path.sep, '/')

    const cwd = isMonoPackage
      ? BASE_DIR
      : path.join(BASE_DIR, packagesFolder, pkg)
    const pkgInfo = require(path.join(cwd, 'package.json'))
    const scripts = pkgInfo.scripts || {}

    let releaseCommands = [
      ['npm', ['--no-git-tag-version', 'version', `${RELEASE_CODES[code]}`]],
      ['git', ['add', cwd]]
    ]
    let docCommands = [
      [suiMonoBinPath, ['changelog', cwd]],
      ['git', ['add', cwd]],
      ['git', ['commit --amend --no-verify --no-edit']]
    ]
    let publishCommands = [
      scripts['build'] && ['npm', ['run', 'build']],
      !pkgInfo.private && ['npm', ['publish', `--access=${publishAccess}`]],
      ['git', ['push', '--tags', 'origin', 'HEAD']]
    ].filter(Boolean)

    serialSpawn(releaseCommands, {cwd})
      .then(() => {
        // Create release commit
        const {version} = getPackageJson(cwd, true)
        return serialSpawn(
          [['git', [`commit -m "release(${packageScope}): v${version}"`]]],
          {cwd}
        )
      })
      .then(() => serialSpawn(docCommands))
      .then(() => {
        // Create release tag
        const {version} = getPackageJson(cwd)
        return serialSpawn(
          [['git', [`tag -a ${tagPrefix}${version} -m "v${version}"`]]],
          {cwd}
        )
      })
      .then(() => serialSpawn(publishCommands, {cwd}))
      .then(resolve)
      .catch(reject)
  })
}

const packageScope = program.scope
const releaseMode = packageScope ? singlePackageRelease : releasesByPackages

const checkIsMasterBranchActive = async ({status, cwd}) => {
  try {
    const output = await exec(`git rev-parse --abbrev-ref HEAD`, {
      cwd
    })

    if (output.stdout.trim() === 'master') {
      return Promise.resolve(status)
    } else {
      throw new Error(
        'Active branch is not master, please make releases only in master branch'
      )
    }
  } catch (error) {
    showError(error)

    return Promise.reject(error)
  }
}

checker
  .check()
  .then(status => checkIsMasterBranchActive({status, cwd: process.cwd()}))
  .then(status => releaseMode({status, packageScope}))
  .then(releases =>
    releases
      .filter(({code}) => code !== 0)
      .map(release => () => releaseEachPkg(release))
      // https://gist.github.com/istarkov/a42b3bd1f2a9da393554
      .reduce(
        (m, p) => m.then(v => Promise.all([...v, p()])),
        Promise.resolve([])
      )
  )
  .catch(console.log.bind(console))
