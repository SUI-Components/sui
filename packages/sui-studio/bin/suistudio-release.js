/* eslint no-console:0 */

const spawn = require('child_process').spawn
const BASE_DIR = process.cwd()

const RELEASE_CODES = {
  0: 'clean',
  1: 'path',
  2: 'minor',
  3: 'major'
}

const releasesByPackages = (pkg) => {
  return new Promise((resolve, reject) => {
    spawn('suistudio', ['check-release', pkg])
      .on('error', reject)
      .on('close', (code) => resolve({pkg, code: code}))
  })
}

const releasesStatus = require('./walker').componentsName(BASE_DIR).map(releasesByPackages)

const releaseEachPkg = ({pkg, code} = {}) => {
  return new Promise((resolve, reject) => {
    if (code === 0) { return resolve() }
    const version = spawn('npm', ['--no-git-tag-version', 'version', RELEASE_CODES[code]], {cwd: `${BASE_DIR}/components/${pkg}`})
                      .on('error', reject)
                      .on('close', resolve)
    version.stdout.pipe(process.stdout)
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
