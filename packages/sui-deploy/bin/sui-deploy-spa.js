#!/usr/bin/env node
/* eslint no-console:0 no-template-curly-in-string:0 */

const program = require('commander')
const NowClient = require('now-client')
const getBranch = require('git-branch')
const {toKebabCase} = require('@s-ui/js/lib/string')
const {getSpawnPromise, showError, showWarning} = require('@s-ui/helpers/cli')
const {writeFile, removeFile} = require('@s-ui/helpers/file')
const DEFAULT_FOLDER = './public'
const NOW_TOKEN_OPTION = '-t $NOW_TOKEN'

// Write package.json file with serve dependency for an SPA deployment
const writePackageJson = ({name, path, auth} = {}) => {
  const serveCommand = ['serve', '.', '--single', auth ? '--auth' : undefined]
  const packageJson = {
    name: `@sui-deploy/${name}`,
    scripts: {
      start: serveCommand.join(' ')
    },
    dependencies: {
      serve: 'latest'
    }
  }
  return writeFile(path, JSON.stringify(packageJson))
}

// Get args of `now` command according to params
const getNowCommandArgs = ({deployName, auth, buildFolder}) => {
  const args = [buildFolder, '--name=' + deployName, '--npm', NOW_TOKEN_OPTION]
  if (auth) {
    const [user, password] = auth.split(':')
    user &&
      password &&
      args.push(`-e SERVE_USER='${user}'`, `-e SERVE_PASSWORD='${password}'`)
  }
  return args
}

program
  .usage(`[options] <name> [folder]`)
  .option('-n, --now', 'Deploy to now.sh')
  .option('-b, --branch', 'Append name of the current branch to name')
  .option(
    '-a, --auth <user:password>',
    "HTTP authentication user and pass separated by ':' ( -a 'my-user:my-password' )"
  )
  .option('-p, --public', 'Skip HTTP authentication')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Deploy build folder to now.sh')
    console.log('  [folder] defaults to ./public')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-deploy spa my-app-name ./dist')
    console.log(
      "    $ NOW_TOKEN=my-token; sui-deploy spa my-app-name ./dist -a 'my-user:my-password'"
    )
    console.log('')
  })
  .parse(process.argv)

if (!program.now) {
  console.log('ERR: --now is the only hosting service available')
  process.exit(1)
}

const [deployName, buildFolder = DEFAULT_FOLDER] = program.args
const {auth, public: publicDeploy, branch} = program
const now = new NowClient(process.env.NOW_TOKEN)
const buildPackageJsonPath = buildFolder + '/package.json'

if (!auth && !publicDeploy) {
  showError(
    new Error(`Deploy crashed for ${deployName}
  Deploys must be protected with '--auth' by default.
  Or, you can explicitely disabled it with '--public'.
  If '--public' is used, your deploy will be ACCESSIBLE and INDEXABLE.`),
    program
  )
}

if (publicDeploy) {
  showWarning(
    `'--public' option found. ${deployName} will be ACCESSIBLE and INDEXABLE.`
  )
}

const executeDeploy = async ({deployName, buildFolder, branch}) => {
  deployName += branch ? '-' + (await getBranch()) : ''
  deployName = toKebabCase(deployName)

  return (
    getSpawnPromise('now', ['rm', deployName, '--yes', NOW_TOKEN_OPTION])
      .catch(() => {}) // To bypass now rm error on the first deploy
      .then(() =>
        writePackageJson({name: deployName, path: buildPackageJsonPath, auth})
      ) // Add package.json for SPA server
      .then(() =>
        getSpawnPromise(
          'now',
          getNowCommandArgs({deployName, buildFolder, auth})
        )
      )
      .then(() => removeFile(buildPackageJsonPath)) // Remove package.json only used by now.sh
      .then(() => now.getDeployments())
      .then(
        deployments => deployments.filter(d => d.name === deployName)[0].url
      )
      // Parse deployment name to make the alias point to it
      .then(
        deployId =>
          deployId
            ? getSpawnPromise('now', [
                'alias',
                deployId,
                deployName,
                NOW_TOKEN_OPTION
              ])
            : Promise.reject(new Error('Deploy crashed for ' + deployName))
      )
      .catch(err => {
        showError(err, program)
      })
  )
}

executeDeploy({deployName, buildFolder, branch})
