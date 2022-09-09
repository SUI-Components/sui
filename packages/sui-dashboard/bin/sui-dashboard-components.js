#!/usr/bin/env node
/* eslint no-console:0 */

import {writeFileSync} from 'fs'
import {tmpdir} from 'os'
import {join} from 'path'

import commander from 'commander'

import {parallelSpawn, serialSpawn} from '@s-ui/helpers/cli.js'

import {stats} from '../src/index.js'

commander
  .option('-v, --versions', 'output versions used')
  .option('-o, --output <filename>', 'save result on filename')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-dashboard components')
    console.log('')
  })
  .parse(process.argv)

const {versions, output} = commander.opts()

const WORK_DIRECTORY = join(tmpdir(), Date.now().toString())
const FLAGS_INSTALL = [
  // Setting cache is required for concurrent `npm install`s to work
  'ignore-scripts',
  'json',
  'legacy-peer-deps',
  'loglevel error',
  'no-bin-links',
  'no-optional',
  'no-package-lock',
  'no-shrinkwrap',
  'prefer-offline',
  'production',
  'progress false',
  'save-exact',
  `cache=${join(WORK_DIRECTORY, 'cache')}`
]

const repositories = [
  'frontend-ma--uilib-widgets',
  'frontend-ma--web-app',

  'frontend-cf--web-app',
  'frontend-mt--uilib-widgets-coches-pro',
  'frontend-mt--uilib-widgets-coches',
  'frontend-mt--uilib-widgets-motos',
  'frontend-mt--web-app',

  'frontend-fc--uilib-widgets',
  'frontend-fc--web-server',

  'frontend-hab--uilib-widgets',
  'frontend-hab--web-app',
  'frontend-hab--web-professional',

  'frontend-ij--uilib-widgets',
  'frontend-ij--web-app',
  'frontend-ij--web-backoffice',

  'frontend-if--uilib-widgets',

  'frontend-ep--uilib-widgets',

  'frontend-re--ut-web-app',

  'frontend-adit--uilib-genos'
]

const cloneSUIComponentsCommand = [
  [
    'git',
    [
      'clone',
      'https://github.com/SUI-Components/sui-components',
      join(WORK_DIRECTORY, 'sui-components')
    ]
  ]
]

const cloneCommands = repositories.map(repo => [
  'git',
  [
    'clone',
    `git@github.mpi-internal.com:scmspain/${repo}.git`,
    join(WORK_DIRECTORY, repo)
  ]
])

const installCommands = repositories.map(repo => [
  'npm',
  ['install', ...FLAGS_INSTALL.map(f => `--${f}`)],
  {cwd: join(WORK_DIRECTORY, repo)}
])

await parallelSpawn(cloneSUIComponentsCommand)
await parallelSpawn(cloneCommands)
await serialSpawn(installCommands)
const statsComponents = await stats({
  repositories,
  root: WORK_DIRECTORY,
  getVersions: versions
})

console.log(statsComponents)
if (output) {
  writeFileSync(output, JSON.stringify(statsComponents, null, 2), 'utf8')
}
