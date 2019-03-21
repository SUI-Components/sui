const getDeployClientFromProgram = async program => {
  const deployName = await getDeployNameFromProgram(program)

  if (!program.now) {
    const {showError} = require('@s-ui/helpers/cli')
    showError('ERR: --now is the only hosting service available', program)
  } else {
    return getNowDeployClient({
      authToken: process.env.NOW_TOKEN,
      deployName
    })
  }
}

const getDeployNameFromProgram = async program => {
  const getGitBranch = require('git-branch')
  const toKebabCase = require('lodash.kebabcase')
  const [deployBaseName] = program.args
  const deployName =
    deployBaseName +
    (program.branch
      ? '-' + (process.env.TRAVIS_BRANCH || (await getGitBranch()))
      : '')
  return toKebabCase(deployName)
}

const getNowDeployClient = ({authToken, deployName}) => {
  const NowDeployClient = require('./client/now')
  return new NowDeployClient({authToken, deployName})
}

module.exports = {
  getDeployClientFromProgram
}
