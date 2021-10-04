#!/usr/bin/env node
/* eslint no-console:0 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const program = require('commander')
const {parallelSpawn, serialSpawn} = require('@s-ui/helpers/cli')
const {stats} = require('../src')

program
  .option('-v, --versions', 'output versions used')
  .option('-o, --output <filename>', 'save result on filename')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-dashboard components')
    console.log('')
  })
  .parse(process.argv)

const programOptions = program.opts()

const WORK_DIRECTORY = path.join(os.tmpdir(), Date.now().toString())
const FLAGS_INSTALL = [
  // Setting cache is required for concurrent `npm install`s to work
  `cache=${path.join(WORK_DIRECTORY, 'cache')}`,
  'no-package-lock',
  'no-shrinkwrap',
  'no-optional',
  'no-bin-links',
  'legacy-peer-deps',
  'prefer-offline',
  'progress false',
  'loglevel error',
  'ignore-scripts',
  'save-exact',
  'production',
  'json'
]

const repositories = [
  'frontend-ma--uilib-widgets',
  'frontend-ma--web-app-plus',
  'frontend-ma--web-app',

  'frontend-cf--web-app',
  'frontend-mt--uilib-widgets-coches-pro',
  'frontend-mt--uilib-widgets-coches',
  'frontend-mt--uilib-widgets-motos',
  'frontend-mt--web-app',

  'frontend-fc--uilib-widgets',
  'frontend-fc--web-server',
  'frontend-fcbw--uilib-widgets',

  'frontend-hab--uilib-widgets',
  'frontend-hab--web-app',
  'frontend-hab--web-professional',

  'frontend-ij--uilib-widgets',
  'frontend-ij--web-app',

  'frontend-if--uilib-widgets',

  'frontend-re--ut-web-app'
]

const cloneSUIComponentsCommand = [
  [
    'git',
    [
      'clone',
      'https://github.com/SUI-Components/sui-components',
      path.join(WORK_DIRECTORY, 'sui-components')
    ]
  ]
]

const cloneCommands = repositories.map(repo => [
  'git',
  [
    'clone',
    `git@github.mpi-internal.com:scmspain/${repo}.git`,
    path.join(WORK_DIRECTORY, repo)
  ]
])

const installCommands = repositories.map(repo => [
  'npm',
  ['install', ...FLAGS_INSTALL.map(f => `--${f}`)],
  {cwd: path.join(WORK_DIRECTORY, repo)}
])

;(async () => {
  await parallelSpawn(cloneSUIComponentsCommand)
  await parallelSpawn(cloneCommands)
  await serialSpawn(installCommands)
  const statsComponents = await stats({
    repositories,
    root: WORK_DIRECTORY,
    getVersions: programOptions.versions
  })

  console.log(statsComponents)
  if (programOptions.output) {
    fs.writeFileSync(
      program.output,
      JSON.stringify(statsComponents, null, 2),
      'utf8'
    )
  }
})()
