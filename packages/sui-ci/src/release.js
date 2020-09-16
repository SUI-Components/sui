const {command: execute} = require('execa')

/**
 * Release packages of the repository on CI
 * @param {object}  params
 * @param {string=} params.gitHubEmail Github Email to be used when commiting
 * @param {string}  params.gitHubToken Personal token from GitHub or GitHub Enterprise
 * @param {string=} params.gitHubUser Github Username to be used when commiting
 * @param {string}  params.pullRequestNumber Number of Pull Request
 * @returns {Promise}
 */
module.exports = async function release({
  gitHubEmail = 'srv.scms.git-enb@adevinta.com',
  gitHubToken,
  gitHubUser = 'Adevinta',
  pullRequestNumber
}) {
  if (!gitHubToken) {
    console.error('[sui-ci release] GitHub Token not provided')
    process.exit(1)
  }

  if (!pullRequestNumber) {
    console.info("[sui-ci release] Nothing to release, we're in a Pull Request")
    return process.exit(0)
  }

  return execute(
    `sui-mono release --github-email "${gitHubEmail}" --github-user "${gitHubUser}" --github-token ${gitHubToken}`
  )
}
