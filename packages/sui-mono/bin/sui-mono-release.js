/* eslint no-console:0 */

const {promisify} = require('util')
const program = require('commander')
const path = require('path')
const {showError} = require('@s-ui/helpers/cli')
const {getPackageJson} = require('@s-ui/helpers/packages')
const exec = promisify(require('child_process').exec)
const gitUrlParse = require('git-url-parse')
const {checkIsMonoPackage, getChangelogFilename, getPublishAccess} = require('../src/config.js')
const checker = require('../src/check.js')

program
  .option('-S, --scope <scope>', 'release a single scope')
  .option('-T, --github-token <token>', 'github token')
  .option('-U, --github-user <user>', 'github user')
  .option('-E, --github-email <email>', 'github email')
  .option('-L, --lock', 'Commit lock file', false)
  .option('--skip-ci', 'Add [skip ci] to release commit message', false)
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Release your packages based on the version check output')
    console.log('')
    console.log("    It's adviced that you inspect the output on sui-mono check before releasing")
    console.log('    Release is the process of:')
    console.log('     - Build your project (executing prepare npm script)')
    console.log('     - Updating package.json version')
    console.log('     - Creating a release commit type')
    console.log('     - Publishing the package to npm (if not private)')
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

const {scope: packageScope, githubEmail, githubToken, githubUser, lock, skipCi} = program.opts()

const BASE_DIR = process.cwd()

const suiMonoBinPath = require.resolve('@s-ui/mono/bin/sui-mono')
const changelogFilename = getChangelogFilename()

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

const releasesByPackages = ({status}) => {
  return Object.keys(status)
    .filter(scope => (packageScope ? scope === packageScope : true))
    .map(scope => scopeMapper({scope, status}))
}

const getCwd = ({pkg}) => {
  const isMonoPackage = checkIsMonoPackage()
  return isMonoPackage ? BASE_DIR : path.join(process.cwd(), pkg)
}

const commit = async ({pkg, code, skipCi}) => {
  const isMonoPackage = checkIsMonoPackage()
  const cwd = getCwd({pkg})

  const tagPrefix = isMonoPackage ? '' : `${pkg}-`
  const packageScope = isMonoPackage ? 'Root' : pkg.replace(path.sep, '/')

  await exec(`npm --no-git-tag-version version ${RELEASE_CODES[code]}`, {cwd})
  await exec(`git add ${path.join(cwd, 'package.json')}`, {cwd})

  const {version} = getPackageJson(cwd, true)

  // Add [skip ci] to the commit message to avoid CI build
  // https://docs.travis-ci.com/user/customizing-the-build/#skipping-a-build
  const skipCiSuffix = skipCi ? ' [skip ci]' : ''
  const commitMsg = `release(${packageScope}): v${version}${skipCiSuffix}`
  await exec(`git commit -m "${commitMsg}"`, {cwd})

  await exec(`${suiMonoBinPath} changelog ${cwd}`)
  await exec(`git add ${path.join(cwd, changelogFilename)}`, {cwd})
  await exec(`git commit --amend --no-verify --no-edit`, {cwd})

  await exec(`git tag -a ${tagPrefix}${version} -m "v${version}"`, {cwd})
}

const publish = async ({pkg}) => {
  const cwd = getCwd({pkg})
  const {private: isPrivatePackage, config: localPackageConfig} = getPackageJson(cwd, true)

  if (!isPrivatePackage) {
    const publishAccess = getPublishAccess({localPackageConfig})
    await exec(`npm publish --access=${publishAccess}`, {cwd})
  }
}

const checkIsMasterBranchActive = async () => {
  const {stdout} = await exec(`git rev-parse --abbrev-ref HEAD`)
  return stdout.trim() === 'master'
}

const prepareAutomaticRelease = async ({githubToken, githubUser, githubEmail}) => {
  const {stdout} = await exec('git config --get remote.origin.url')
  const repoURL = stdout.trim()
  const gitURL = gitUrlParse(repoURL).toString('https')
  const authURL = new URL(gitURL)
  authURL.username = githubToken

  const {stdout: rawIsShallowRepository} = await exec('git rev-parse --is-shallow-repository')
  const isShallowRepository = rawIsShallowRepository === 'true'

  if (isShallowRepository) await exec(`git pull --unshallow --quiet`)

  await exec(`git config --global user.email "${githubEmail}"`)
  await exec(`git config --global user.name "${githubUser}"`)
  await exec('git remote rm origin')
  await exec(`git remote add origin ${authURL} > /dev/null 2>&1`)
  await exec(`git checkout master`)
  await exec(`git pull origin master`)
}

const checkIsAutomaticRelease = ({githubToken, githubUser, githubEmail}) => githubToken && githubUser && githubEmail

const checkShouldRelease = async () => {
  await exec('git pull origin master')

  const [isAutomaticRelease, isMasterBranchActive] = await Promise.all([
    checkIsAutomaticRelease({githubEmail, githubToken, githubUser}),
    checkIsMasterBranchActive()
  ])

  return {isAutomaticRelease, isMasterBranchActive}
}

checkShouldRelease()
  .then(({isAutomaticRelease, isMasterBranchActive}) => {
    const shouldRelease = isAutomaticRelease || isMasterBranchActive

    if (!shouldRelease) {
      console.log('[sui-mono release] No release is needed')
      return
    }

    return checker.check().then(async status => {
      if (isAutomaticRelease) {
        await prepareAutomaticRelease({
          githubEmail,
          githubToken,
          githubUser
        })
      }

      const packagesToRelease = releasesByPackages({status}).filter(({code}) => code !== 0)

      for (const pkg of packagesToRelease) {
        await commit({...pkg, skipCi})
      }

      if (packagesToRelease.length > 0) {
        if (lock) {
          await exec(
            'npm install --package-lock-only --legacy-peer-deps --no-audit --no-fund --ignore-scripts --production=false'
          )
          await exec('git add package-lock.json')
          await exec('git commit -m "chore(Root): update package-lock.json [skip ci]" --no-verify')
        }

        await exec('git push --atomic --tags origin HEAD --no-verify')
      }

      await Promise.all(packagesToRelease.map(pkg => publish(pkg)))

      console.log(`[sui-mono release] ${packagesToRelease.length} packages released`)
    })
  })
  .catch(err => {
    console.error(err)
    showError(err)
  })
