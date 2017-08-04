/* eslint no-console:0 */

const path = require('path')
const config = require('../src/config')
const checker = require('../src/check')
const { serialSpawn } = require('@schibstedspain/sui-helpers/cli')

const BASE_DIR = process.cwd()

const packagesFolder = config.getPackagesFolder()
const publishAccess = config.getPublishAccess()

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

    const packageName = isMonoPackage
      ? 'META'
      : pkg

    const cwd = isMonoPackage
      ? BASE_DIR
      : path.join(BASE_DIR, packagesFolder, packageName)
    const pkgInfo = require(path.join(cwd, 'package.json'))
    const scripts = pkgInfo.scripts || {}

    let commands = [
      ['npm', ['--no-git-tag-version', 'version', `${RELEASE_CODES[code]}`]],
      ['git', ['add', cwd]],
      ['git', ['commit -m "release(' + packageName + '): v$(node -p -e "require(\'./package.json\')".version)"']],
      !pkgInfo.private && ['npm', ['publish', `--access=${publishAccess}`]],
      ['git', ['push', 'origin', 'HEAD']]
    ].filter(Boolean)
    scripts['build'] && commands.unshift(['npm', ['run', 'build']])

    serialSpawn(commands, {cwd})
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
