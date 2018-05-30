#!/usr/bin/env node
/* eslint no-console:0 */

const program = require('commander')
const path = require('path')
const config = require('../src/config')
const {spawnList} = require('@s-ui/helpers/cli')
const {
  getPackagesPaths,
  getPackagesNames,
  getInternalDependencyMap,
  getUsedInternalDependencies
} = require('@s-ui/helpers/packages')

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log(
      '    Links all the packages in the current project with all the dependencies that are also part of the project'
    )
    console.log('    For example sui-studio has a dependency on sui-mono')
    console.log(
      '    If you perform this command you will have your local sui-mono linked to your local sui-studio'
    )
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-mono link')
    console.log('    $ sui-mono --help')
    console.log('    $ sui-mono -h')
    console.log('')
  })
  .parse(process.argv)

const packages = config.getScopes()
const cwd = path.join(process.cwd(), config.getPackagesFolder())
const packagesPaths = [...getPackagesPaths(cwd)(packages), process.cwd()]
const packagesNames = [...getPackagesNames(cwd)(packages), null]

const dependenciesMap = getInternalDependencyMap(packagesPaths)(packagesNames)
const usedDependenciesPaths = getUsedInternalDependencies(packagesPaths)(
  packagesNames
)
const createCommands = linkingMap => {
  const linkedPackages = []
  const createCommandsForMap = pkg => {
    const {name, path, deps} = pkg
    const commands = []
    if (deps.length) {
      deps.forEach(dep =>
        commands.push(...createCommandsForMap(linkingMap[dep]))
      )
      commands.push(['npm', ['link', ...deps], {cwd: path}])
    }
    if (
      usedDependenciesPaths.includes(path) &&
      !linkedPackages.includes(name)
    ) {
      commands.push(['npm', ['link'], {cwd: path}])
      linkedPackages.push(name)
    }
    return commands
  }
  return createCommandsForMap
}
const linkingMap = dependenciesMap.reduce((obj, [path, deps]) => {
  const name = packagesNames[packagesPaths.indexOf(path)]
  if (name) {
    obj[name] = {name, path, deps}
  }
  return obj
}, {})

const createCommandsForMap = createCommands(linkingMap)
const commands = Object.values(linkingMap).reduce(
  (res, pkg) => [...res, ...createCommandsForMap(pkg)],
  []
)

// Execute commands
spawnList(commands, {}, 10)
  .then(process.exit)
  .catch(process.exit)
