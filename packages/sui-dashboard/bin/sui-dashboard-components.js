#!/usr/bin/env node
/* eslint no-console:0 */

const path = require('path')
const program = require('commander')
const {parallelSpawn} = require('@s-ui/helpers/cli')
const {stats} = require('../src')

program
  .option(
    '--dry',
    'just print the info in console, Dont update the remote excel'
  )
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-dashboard components')
    console.log('    $ sui-dashboard components --dry')
    console.log('')
  })
  .parse(process.argv)

const WORK_DIRECTORY = Date.now()
const FLAGS_INSTALL = [
  // Setting cache is required for concurrent `npm install`s to work
  `cache=${path.join(`/tmp/${WORK_DIRECTORY}`, 'cache')}`,
  'no-package-lock',
  'no-shrinkwrap',
  'no-optional',
  'no-bin-links',
  'prefer-offline',
  'progress false',
  'loglevel error',
  'ignore-scripts',
  'save-exact',
  'production',
  // "fetch-retry-factor 0",
  // "fetch-retries 0",
  'json'
]
const repositories = [
  'frontend-vb--uilib-widgets',

  'frontend-ma--web-app',
  'frontend-ma--uilib-widgets',

  'frontend-mt--web-app',
  'frontend-mt--uilib-widgets',

  'frontend-fc--web-server',
  'frontend-fc--uilib-widgets',
  'frontend-fcbw--uilib-widgets',

  'frontend-ij--uilib-widgets'
]

const cloneSUIComponentsCommand = [
  [
    'git',
    [
      'clone',
      'https://github.com/SUI-Components/sui-components',
      `/tmp/${WORK_DIRECTORY}/sui-components`
    ]
  ]
]

const cloneCommands = repositories.map(repo => [
  'git',
  [
    'clone',
    `git@github.schibsted.io:scmspain/${repo}.git`,
    `/tmp/${WORK_DIRECTORY}/${repo}`
  ]
])

const installCommands = repositories.map(repo => [
  'npm',
  ['install', ...FLAGS_INSTALL.map(f => `--${f}`)],
  {cwd: `/tmp/${WORK_DIRECTORY}/${repo}`}
])
;(async () => {
  await parallelSpawn(cloneSUIComponentsCommand)
  await parallelSpawn(cloneCommands)
  await parallelSpawn(installCommands)
  await stats({repositories, root: `/tmp/${WORK_DIRECTORY}`})
  // await stats({repositories, root: `/tmp/1544457748852`})
})()
