const util = require('util')
const exec = util.promisify(require('child_process').exec)

/**
 * Release packages of the repository on CI
 * @param {object}  params
 * @param {string=} params.gitHubEmail Github Email to be used when commiting
 * @param {string}  params.gitHubToken Personal token from GitHub or GitHub Enterprise
 * @param {string=} params.gitHubUser Github Username to be used when commiting
 * @param {Boolean} params.isPullRequest Determine if it's a Pull Request
 * @returns {Promise}
 */
module.exports = async function release({
  gitHubEmail = 'srv.scms.git-enb@adevinta.com',
  gitHubToken,
  gitHubUser = 'Adevinta',
  isPullRequest
}) {
  if (isPullRequest) {
    console.info(`[sui-ci release] Nothing to release as it's a Pull Request`)
    return process.exit(0)
  }

  if (!gitHubToken) {
    console.error('[sui-ci release] GitHub Token not provided')
    return process.exit(1)
  }

  console.info(`[sui-ci release] Pull latest changes...`)
  await exec('git pull origin master')

  console.info(`[sui-ci release] Executing sui-mono release...`)
  const {stdout} = await exec(
    `sui-mono release --github-email "${gitHubEmail}" --github-user "${gitHubUser}" --github-token ${gitHubToken} --skip-ci`
  )
  console.log(stdout)

  console.info('[sui-ci release] Finished')
}
