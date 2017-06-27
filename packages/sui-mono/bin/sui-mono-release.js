/* eslint no-console:0 */

const path = require('path')
const config = require('../src/config')
const checker = require('../src/check')
const { serialSpawn } = require('@schibstedspain/sui-helpers/cli')

const BASE_DIR = process.cwd()

const packages = config.getScopes()
const packagesFolder = config.getPackagesFolder()
const publishAccess = config.getPublishAccess()

const RELEASE_CODES = {
  0: 'clean',
  1: 'path',
  2: 'minor',
  3: 'major'
}

const releasesByPackages = (pkg) => {
  return checker.check().then((status) => {
    return {pkg, code: status[pkg].increment}
  })
}

const releasesStatus = packages.map(releasesByPackages)

const releaseEachPkg = ({pkg, code} = {}) => {
  return new Promise((resolve, reject) => {
    if (code === 0) { return resolve() }

    const cwd = path.join(BASE_DIR, packagesFolder, pkg)
    const scripts = require(path.join(cwd, 'package.json')).scripts || {}

    let commands = [
      ['npm', ['--no-git-tag-version', 'version', `${RELEASE_CODES[code]}`]],
      ['git', ['add', cwd]],
      ['sh', ['-c', `VERSION=$(node -p -e "require('./package.json').version") && git commit -m "release(${pkg}): v$VERSION"`]],
      ['npm', ['publish', `--access=${publishAccess}`]],
      ['git', ['push', 'origin', 'master']]
    ]
    scripts['build'] && commands.unshift(['npm', ['run', 'build']])

    serialSpawn(commands, {cwd})
      .then(resolve)
      .catch(reject)
  })
}

Promise.all(releasesStatus)
       .then(releases =>
          releases
            .filter(({code}) => code !== 0)
            .map(release => () => releaseEachPkg(release))
            // https://gist.github.com/istarkov/a42b3bd1f2a9da393554
            .reduce((m, p) => m.then(v => Promise.all([...v, p()])), Promise.resolve([]))
        )
       .catch(console.log.bind(console))
