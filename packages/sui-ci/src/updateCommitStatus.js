const {Octokit} = require('@octokit/core')
const {
  STATUS_CONTEXT,
  STATUS_DESCRIPTION,
  STATUS_STATES
} = require('./constants')

/**
 * Update GitHub commit status
 * @param {object} params
 * @param {string} params.auth Personal token from GitHub or GitHub Enterprise
 * @param {string} params.commit Commit SHA to update its status
 * @param {string} params.stateKey Key to grab the state info
 * @param {string} params.targetUrl Url where the `Details` link on the status will navigate to
 * @param {string} params.topic It indicates what the commit new status is about
 * @param {string} params.repoSlug Slug with the format ${owner}/${repositoryName}
 * @returns {Promise}
 */
module.exports = function updateCommitStatus({
  auth,
  commit,
  stateKey,
  targetUrl,
  topic,
  repoSlug
}) {
  const [owner, repo] = repoSlug.split('/')
  const state = STATUS_STATES[stateKey]

  const requestParams = {
    context: `${STATUS_CONTEXT} (${topic})`,
    description: STATUS_DESCRIPTION[topic][state],
    owner,
    repo,
    sha: commit,
    state,
    target_url: targetUrl
  }

  const octokit = new Octokit({auth})
  return octokit.request(
    'POST /repos/{owner}/{repo}/statuses/{sha}',
    requestParams
  )
}
