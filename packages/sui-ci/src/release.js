const {command: execute} = require('execa')

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

  try {
    await execute('git pull origin master')

    const {stdout} = await execute(
      `sui-mono release --github-email "${gitHubEmail}" --github-user "${gitHubUser}" --github-token ${gitHubToken} --skip-ci`
    )
    console.info(stdout)
    console.info('[sui-ci release] Success!')
  } catch (e) {
    console.error('[sui-ci release] Something went wrong:')
    console.error(e.message)
    return process.exit(1)
  }
}
