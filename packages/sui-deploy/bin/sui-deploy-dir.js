#!/usr/bin/env node
/* eslint no-console:0 no-template-curly-in-string:0 */

const program = require('commander')
const {showError} = require('@s-ui/helpers/cli')
const {getDeployClientFromProgram} = require('../src/utils')

function collect(value, variables) {
  variables.push(value)
  return variables
}

program
  .usage(`[options] <name> <folder>`)
  .option('-n, --now', 'Deploy to now.sh')
  .option('-b, --branch', 'Append name of the current branch to name')
  .option(
    '-e, --environmentVars [environmentVars]',
    'One or more enviornment variables that will be passed to the deployer command',
    collect,
    []
  )
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Deploy build folder to now.sh')
    console.log('  [folder] defaults to ./public')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-deploy my-app-name ./dist --now')
    console.log('    $ NOW_TOKEN=my-token; sui-deploy my-app-name ./dist --now')
    console.log('')
  })
  .parse(process.argv)

const executeDeploy = async program => {
  const [, buildFolder] = program.args
  const environmentVars = program.environmentVars
  const deployer = await getDeployClientFromProgram(program)
  const deployUrl = await deployer.deploy(buildFolder, {environmentVars})
  console.log(`Deployment URL: ${deployUrl}`)
}

executeDeploy(program).catch(err => {
  showError(err, program)
})
