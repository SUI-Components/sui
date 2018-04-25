const path = require('path')

/**
 * Get absolute paths of packages
 * @param  {String} cwd
 * @param  {Array} packages
 * @return {Array}
 */
const getPackagesPaths = (cwd) => {
  const getPath = path.join.bind(this, cwd)
  return (packages) => packages.map((pkg) => getPath(pkg))
}

/**
 * Get Package JSON info
 * @param  {String} packagePath Absolute pathç
 * @return {Object} {} in case of error
 */
const getPackageJson = (packagePath) => {
  try {
    return require(path.join(packagePath, 'package.json'))
  } catch (e) {
    return {}
  }
}

/**
 * Get list of dependencies of a path
 * @param  {String} packagePath Absolute pathç
 * @return {Array} Both prod and dev deps are returned
 */
const getPackageDependencies = (packagePath) => {
  const pkg = getPackageJson(packagePath)
  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]
}

/**
 * Get npm names of packages from paths
 * @param  {String} cwd
 * @param  {Array} packages
 * @return {Array}
 */
const getPackagesNames = (cwd) => {
  const getPaths = getPackagesPaths(cwd)
  return (packages) => {
    return getPaths(packages)
      .map((pkgPath) => getPackageJson(pkgPath).name)
  }
}

/**
 * Get path of a package from npm name
 * @param  {Array<String>} cwds Absolute path of packages
 * @param  {Array<String>} packages Names of packages
 * @param  {String} name Package name
 * @return {String}
 */
const mapNameToPath = (cwds) => (packages) => (name) => cwds[packages.indexOf(name)]

/**
 * Get which dependencies are included in provided path
 * @param  {Array<String>} dependencies NPM names of packages
 * @param  {String} pkgPath Path to browse
 * @return {Array<Array>} index[0] is a path, index[1] re found dependencies
 */
const getDependenciesBeingUsed = (dependencies) => (pkgPath) => {
  var deps = getPackageDependencies(pkgPath)
  return deps.filter(name => dependencies.indexOf(name) !== -1)
}

/**
 * Get map of actual dependencies for a list of paths
 * @param  {Array<String>} cwds Absolute paths of projects
 * @param  {Array<String>} dependencies NPM names of packages
 * @return {Array<Array>} index[0] is a path, index[1] re found dependencies
 */
const getDependencyMap = (cwds) => (dependencies) => {
  const getLocalDependencies = getDependenciesBeingUsed(dependencies)
  return cwds
    .map((cwd) => [cwd, getLocalDependencies(cwd)])
}

/**
 * Same as getDependencyMap(), but paths with no local deps are filtered.
 * @param  {Array<String>} cwds Absolute paths of projects
 * @param  {Array<String>} dependencies NPM names of packages
 * @return {Array<String>}
 */
const getInternalDependencyMap = (cwds) => (dependencies) => {
  return getDependencyMap(cwds)(dependencies)
}

/**
 * Get list of npm names of packages used locally by each other
 * @param  {Array<String>} cwds Absolute paths of projects
 * @param  {Array<String>} dependencies NPM names of packages
 * @return {Array<String>} NPM names of packages
 */
const getUsedInternalDependencies = (cwds) => (dependencies) => {
  return getInternalDependencyMap(cwds)(dependencies)
    .reduce((result, [, dependencies]) => [...result, ...dependencies], []) // Reduce to array of dependencies
    .filter((dep, idx, dependencies) => dependencies.indexOf(dep) === idx) // Remove duplicated
    .map(mapNameToPath(cwds)(dependencies))
}

module.exports = {
  getPackageJson,
  getPackageDependencies,
  getDependenciesBeingUsed,
  getPackagesPaths,
  getPackagesNames,
  getDependencyMap,
  getInternalDependencyMap,
  getUsedInternalDependencies
}
