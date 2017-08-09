#!/usr/bin/env node
/* eslint no-console:0 */

const program = require('commander')
const path = require('path')
const config = require('../src/config')
const { serialSpawn } = require('@schibstedspain/sui-helpers/cli')
const {
  getPackagesPaths, getPackagesNames,
  getInternalDependencyMap, getUsedInternalDependencies
} = require('@schibstedspain/sui-helpers/packages')

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Links all the packages in the current project with all the dependencies that are also part of the project')
    console.log('    For example sui-studio has a dependency on sui-mono')
    console.log('    If you perform this command you will have your local sui-mono linked to your local sui-studio')
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
