/* eslint no-console:0 */

const program = require('commander')
const path = require('path')
const config = require('../src/config')
const checker = require('../src/check')
const {serialSpawn, showError} = require('@s-ui/helpers/cli')
const {getPackageJson} = require('@s-ui/helpers/packages')
const {exec: execNative} = require('child_process')
const gitUrlParse = require('git-url-parse')
const util = require('util')
const exec = util.promisify(execNative)

program
  .option('-S, --scope <scope>', 'release a single scope')
  .option('-T, --github-token <token>', 'github token')
  .option('-U, --github-user <user>', 'github user')
  .option('-E, --github-email <email>', 'github email')
  .option('--skip-ci', 'Add [skip ci] to release commit message', false)
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Release your packages based on the version check output')
    console.log('')
    console.log(
      '    Its adviced that you inspect the output on sui-mono check before releasing'
    )
    console.log('    Release is the process of:')
    console.log('     - Build your project (with build or prepare npm script)')
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
const changelogFilename = config.getChangelogFilename()

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

const releaseEachPkg = ({pkg, code} = {}, {skipCI} = {}) => {
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

    const releaseCommands = [
      ['npm', ['--no-git-tag-version', 'version', `${RELEASE_CODES[code]}`]],
      ['git', ['add', path.join(cwd, 'package.json')]]
    ]
    const docCommands = [
      [suiMonoBinPath, ['changelog', cwd]],
      ['git', ['add', path.join(cwd, changelogFilename)]],
      ['git', ['commit --amend --no-verify --no-edit']]
    ]
    const publishCommands = [
      scripts.build && ['npm', ['run', 'build']],
      !pkgInfo.private && ['npm', ['publish', `--access=${publishAccess}`]],
      ['git', ['push', '--tags', 'origin', 'HEAD']]
    ].filter(Boolean)

    serialSpawn(releaseCommands, {cwd})
      .then(() => {
        // Create release commit
        const {version} = getPackageJson(cwd, true)

        // We're adding [skip ci] to the commit message to avoid
        // start a build on CI if not needed
        // docs: https://docs.travis-ci.com/user/customizing-the-build/#skipping-a-build
        const commitMsg = `release(${packageScope}): v${version}${
          skipCI ? ' [skip ci]' : ''
        }`

        return serialSpawn([['git', [`commit -m "${commitMsg}"`]]], {cwd})
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
    const {stdout} = await exec(`git rev-parse --abbrev-ref HEAD`, {
      cwd
    })

    if (stdout.trim() === 'master') {
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

const automaticRelease = async ({
  githubToken,
  githubUser,
  githubEmail,
  cwd
}) => {
  const {stdout} = await exec('git config --get remote.origin.url', {cwd})
  const repoURL = stdout.trim()
  const gitURL = gitUrlParse(repoURL).toString('https')
  const authURL = new URL(gitURL)
  authURL.username = githubToken

  const {
    stdout: rawIsShallowRepository
  } = await exec('git rev-parse --is-shallow-repository', {cwd})
  const isShallowRepository = rawIsShallowRepository === 'true'

  if (isShallowRepository) await exec(`git pull --unshallow --quiet`, {cwd})

  await exec(`git config --global user.email "${githubEmail}"`, {cwd})
  await exec(`git config --global user.name "${githubUser}"`, {cwd})
  await exec('git remote rm origin', {cwd})
  await exec(`git remote add origin ${authURL} > /dev/null 2>&1`, {cwd})
  await exec(`git checkout master`, {cwd})
  await exec(`git pull origin master`, {cwd})
}

const isAutomaticRelease = ({githubToken, githubUser, githubEmail}) => {
  return githubToken && githubUser && githubEmail
}

checker
  .check()
  .then(async status => {
    const {githubEmail, githubToken, githubUser} = program
    isAutomaticRelease({
      githubEmail,
      githubToken,
      githubUser
    })
      ? await automaticRelease({
          githubEmail,
          githubToken,
          githubUser,
          cwd: process.cwd()
        })
      : await checkIsMasterBranchActive({status, cwd: process.cwd()})
    return status
  })
  .then(status => releaseMode({status, packageScope}))
  .then(releases =>
    releases
      .filter(({code}) => code !== 0)
      .map(release => () => releaseEachPkg(release, {skipCI: program.skipCi}))
      // https://gist.github.com/istarkov/a42b3bd1f2a9da393554
      .reduce(
        (m, p) => m.then(v => Promise.all([...v, p()])),
        Promise.resolve([])
      )
  )
  .catch(err => {
    console.error('[sui-mono release] ERROR:')
    console.error(err)
    process.exit(1)
  })
