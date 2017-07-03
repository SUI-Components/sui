const path = require('path')
const config = require('../src/config')
const { serialSpawn } = require('@schibstedspain/sui-helpers/cli')
const {
  getPackagesPaths, getPackagesNames,
  getInternalDependencyMap, getUsedInternalDependencies
} = require('@schibstedspain/sui-helpers/packages')

const packages = config.getScopes()
const cwd = path.join(process.cwd(), config.getPackagesFolder())
const packagesPaths = [...getPackagesPaths(cwd)(packages), process.cwd()]
const packagesNames = [...getPackagesNames(cwd)(packages), null]

const dependenciesMap = getInternalDependencyMap(packagesPaths)(packagesNames)
const usedDependenciesPaths = getUsedInternalDependencies(packagesPaths)(packagesNames)

// Generate commands for local packages that are actually used internally used
const linkCommands = usedDependenciesPaths
  .map((cwd) => ['npm', ['link'], {cwd}])

// Generate commands to link packages between each other when used
const linkBetweenCommands = dependenciesMap
  .map(([path, deps]) => ['npm', ['link', ...deps], {cwd: path}])

// Execute commands
serialSpawn([...linkCommands, ...linkBetweenCommands])
  .then(process.exit)
  .catch(process.exit)
