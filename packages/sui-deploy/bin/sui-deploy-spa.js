#!/usr/bin/env node
/* eslint no-console:0 no-template-curly-in-string:0 */

const program = require('commander')
const {showError, showWarning} = require('@s-ui/helpers/cli')
const {getDeployClientFromProgram} = require('../src/utils')

function collect(value, variables) {
  variables.push(value)
  return variables
}

program
  .usage(`[options] <name> [folder]`)
  .option('-n, --now', 'Deploy to now.sh')
  .option('-b, --branch', 'Append name of the current branch to name')
  .option(
    '-a, --auth <user:password>',
    "HTTP authentication user and pass separated by ':' ( -a 'my-user:my-password' )"
  )
  .option(
    '-e, --environmentVars [environmentVars]',
    'One or more enviornment variables that will be passed to the deployer command',
    collect,
    []
  )
  .option('-p, --public', 'Skip HTTP authentication')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Deploy build folder to now.sh as a SPA')
    console.log('  [folder] defaults to ./public')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-deploy spa my-app-name ./dist --now')
    console.log(
      "    $ NOW_TOKEN=my-token; sui-deploy spa my-app-name ./dist -a 'my-user:my-password' --now"
    )
    console.log('')
  })
  .parse(process.argv)

if (!program.now) {
  console.log('ERR: --now is the only hosting service available')
  process.exit(1)
}

const {auth, public: forcePublic} = program

if (!auth && !forcePublic) {
  showError(
    new Error(`Deployment crashed.
  Deploys must be protected with '--auth' by default.
  Or, you can explicitely disabled it with '--public'.
  If '--public' is used, your deploy will be ACCESSIBLE and INDEXABLE.`),
    program
  )
}

if (forcePublic) {
  showWarning(`'--public' option found. App will be ACCESSIBLE and INDEXABLE.`)
}

const executeDeploy = async program => {
  const [, buildFolder] = program.args
  const environmentVars = program.environmentVars
  const deployer = await getDeployClientFromProgram(program)
  const deploytUrl = await deployer.deployAsSPA(buildFolder, {
    auth,
    environmentVars
  })

  console.log(`Deployment URL: ${deploytUrl}`)
}

executeDeploy(program).catch(err => {
  showError(err, program)
})
