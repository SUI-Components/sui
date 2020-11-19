#!/usr/bin/env node
/* eslint no-console:0 */

const {serialSpawn} = require('@s-ui/helpers/cli')
const {join} = require('path')
const fs = require('fs-extra')
const {execSync} = require('child_process')
const program = require('commander')
const {NO_COMPONENTS_MESSAGE} = require('../config')
const copyStaticFiles = require('./helpers/copyStaticFiles')
const copyGlobals = require('./helpers/copyGlobals')

program
  .option('-O, --only-changes', 'only build changed components or demos')
  .option(
    '-B, --before-build <command>',
    'command to be executed before the build'
  )
  .parse(process.argv)

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
console.log(`Environment: ${process.env.NODE_ENV}`)

const bundlerBuildPath = require.resolve('@s-ui/bundler/bin/sui-bundler-build')
const {onlyChanges, beforeBuild} = program
let needsBuild = true
let beforeBuildCommand

if (onlyChanges) {
  const stdout = execSync(
    `node ${join(__dirname, '..', 'scripts', 'prepare-only-changes.js')}`,
    {encoding: 'utf8'}
  )
  needsBuild = !stdout.includes(NO_COMPONENTS_MESSAGE)
}

if (beforeBuild) {
  const [command, ...args] = beforeBuild.split(' ')
  beforeBuildCommand = [command, args]
}

if (needsBuild) {
  copyGlobals()
  serialSpawn(
    [
      beforeBuildCommand,
      [
        bundlerBuildPath,
        ['-C', '--context', join(__dirname, '..', 'src')],
        {
          shell: false,
          env: process.env
        }
      ]
    ].filter(Boolean)
  )
    .then(() => fs.copy('public/index.html', 'public/200.html'))
    .then(copyStaticFiles)
    .then(copyGlobals)
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
