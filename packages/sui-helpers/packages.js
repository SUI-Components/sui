/* eslint no-console:0 */
const path = require('path')
const {getSpawnPromise} = require('./cli')

/**
 * Get absolute paths of packages
 * @param  {String} cwd
 * @return {(packages: Array) => Array<string>}
 */
const getPackagesPaths = cwd => {
  const getPath = path.join.bind(this, cwd)
  return packages => packages.map(pkg => getPath(pkg))
}

/**
 * Get Package JSON info
 * @param  {String} packagePath Absolute path
 * @param  {Boolean} disableCache Disable to require.cache to ensure package.json is re-read
 * @return {Object} {} in case of error
 */
const getPackageJson = (packagePath, disableCache = false) => {
  try {
    const filePath = require.resolve(path.join(packagePath, 'package.json'))
    // Modules are cached in this object when they are required.
    // By deleting a key value from this object, the next require will reload the module.
    if (disableCache) delete require.cache[filePath]

    return require(filePath)
  } catch (e) {
    return {}
  }
}

/**
 * Resolve path in local ./node_modules folder
 * @param {String} binPath  Relative path to file.
 * @return {() => String} Absolute path of the file
 */
const resolveLocalNPMBin = (binPath, cwd) => () =>
  require.resolve(binPath, {
    paths: [path.resolve(cwd, 'node_modules')]
  })

/**
 * Resolve bin path. If not present, installs package prior return.
 * @param {string} binPath Relative path to bin or node file.
 * @param {string} pkg Name of package to install in case of absence. ex: `my-package@8.5`
 * @param {string} cwd Current working directory to use to resolve and execute commands
 * @return {Promise<String>} Absolute path of the file
 */
const resolveLazyNPMBin = async (binPath, pkg, cwd = process.cwd()) => {
  const resolvePkgBin = resolveLocalNPMBin(binPath, cwd)
  try {
    return resolvePkgBin()
  } catch (e) {
    console.info(
      `It looks like the lazy installed dep '${pkg}' is missing. It will be installed now.`
    )
    return getSpawnPromise(
      'npm',
      ['install', `${pkg}`, '--no-save', '--no-fund', '--no-audit'],
      {
        cwd
      }
    ).then(resolvePkgBin)
  }
}

/**
 * Installs and imports packages dynamically.
 * @param {string} name Name of the NPM package.
 * @param {object} options Available options.
 * @param {string} options.version Specific version of the package.
 * @return {Promise<any>} Returns the default module.
 */
const dynamicPackage = async (name, {version} = {}) => {
  const packageName = version ? `${name}@${version}` : name

  try {
    await getSpawnPromise('npm', ['explain', packageName])
  } catch (error) {
    if (error.exitCode === 1) {
      await getSpawnPromise('npm', [
        'install',
        packageName,
        '--no-save',
        '--legacy-peer-deps'
      ])
    }
  }

  return import(packageName).then(module => module.default)
}

module.exports = {
  getPackageJson,
  getPackagesPaths,
  resolveLazyNPMBin,
  dynamicPackage
}
