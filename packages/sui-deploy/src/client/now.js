const NowClient = require('now-client')
const {join} = require('path')
const {writeFile, removeFile} = require('@s-ui/helpers/file')
const DEFAULT_DIR = join(process.cwd(), 'public')

// Get args of `now` command according to params
const getNowCommandArgs = ({name, dir, auth, token}) => {
  const args = [dir, '--name=' + name, `-t "${token}"`]
  if (auth) {
    const [user, password] = auth.split(':')
    user &&
      password &&
      args.push(`-e SERVE_USER='${user}'`, `-e SERVE_PASSWORD='${password}'`)
  }
  return args
}

const getDeploymentsByName = async (now, name) => {
  const deployments = await now.getDeployments()
  return deployments
    .filter(d => d.name === name)
    .sort((a, b) => b.created - a.created)
}

const setAliasToLastDeploy = async (now, name) => {
  const deployments = await getDeploymentsByName(now, name)
  if (deployments.length) {
    const lastDeployId = deployments.pop().uid
    await now.createAlias(lastDeployId, name)
  }
  return `https://${name}.now.sh`
}

// Write package.json file with serve dependency for an SPA deployment
const writePackageJson = ({name, path, auth} = {}) => {
  const serveCommand = ['serve', '.', '--single', auth ? '--auth' : undefined]
  const packageJson = {
    name: `@sui-deploy/${name}`,
    scripts: {
      start: serveCommand.join(' ')
    },
    dependencies: {
      serve: '6'
    }
  }
  return writeFile(path, JSON.stringify(packageJson))
}

class NowDeployClient {
  constructor({authToken, deployName}) {
    this.nowToken = authToken
    this.deployName = deployName
    this.now = new NowClient(this.nowToken)
  }

  async deletePreviousDeployments(deploysToMaintain = 0) {
    const deployments = await getDeploymentsByName(this.now, this.deployName)
    return Promise.all(
      deployments
        .slice(deploysToMaintain)
        .map(({uid}) => this.now.deleteDeployment(uid))
    )
  }

  async deploy(dir = DEFAULT_DIR, {auth} = {}) {
    const {getSpawnPromise} = require('@s-ui/helpers/cli')
    const {deployName: name, nowToken: token} = this

    await getSpawnPromise('now', getNowCommandArgs({name, token, dir, auth}))
    this.deletePreviousDeployments(1)
    return setAliasToLastDeploy(this.now, this.deployName)
  }

  async deployAsSPA(dir = DEFAULT_DIR, {auth}) {
    const {deployName: name} = this
    const path = dir + '/package.json'

    await writePackageJson({name, path, auth})
    const deployUrl = await this.deploy(dir, {auth})
    await removeFile(path)
    return deployUrl
  }
}

module.exports = NowDeployClient
