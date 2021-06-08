#!/usr/bin/env node

const program = require('commander')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const {version} = require('../package.json')

const BIN_PATH = require.resolve('.bin/ts-standard')

program.version(version, '    --version')

program.parse(process.argv)

const cwd = process.cwd()
const project = `${cwd}/tsconfig.json`

;(async () => {
  try {
    await exec(`${BIN_PATH} src/**/*.ts --project=${project}`)
  } catch (error) {
    const {stdout} = error
    console.error(stdout)
  }
})()
