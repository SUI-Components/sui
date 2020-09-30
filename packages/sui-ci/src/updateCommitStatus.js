const {Octokit} = require('@octokit/core')
const parseGitUrl = require('git-url-parse')
const getGitRemoteOriginUrl = require('git-remote-origin-url')

const {
  STATUS_CONTEXT,
  STATUS_DESCRIPTION,
  STATUS_STATES
} = require('./constants')

/**
 * Get the needed API Base Url depending on the remote origin url
 */
async function getApiBaseUrl() {
  const gitRemoteOriginUrl = await getGitRemoteOriginUrl().catch(
    () => 'git@github.com:sui/remote-url.git'
  )
  const {resource} = parseGitUrl(gitRemoteOriginUrl)

  return resource === 'github.com'
    ? 'https://api.github.com'
    : `https://${resource}/api/v3`
}

/**
 * Update GitHub commit status
 * @param {object} params
 * @param {string} params.commit Commit SHA to update its status
 * @param {string} params.gitHubToken Personal token from GitHub or GitHub Enterprise
 * @param {string} params.stateKey Key to grab the state info
 * @param {string} params.targetUrl Url where the `Details` link on the status will navigate to
 * @param {string} params.topic It indicates what the commit new status is about
 * @param {string} params.repoSlug Slug with the format ${owner}/${repositoryName}
 * @returns {Promise}
 */
module.exports = async function updateCommitStatus({
  commit,
  gitHubToken,
  repoSlug,
  stateKey,
  targetUrl,
  topic
}) {
  const [owner, repo] = repoSlug.split('/')
  const state = STATUS_STATES[stateKey]

  const baseUrl = await getApiBaseUrl()

  const requestParams = {
    baseUrl,
    context: `${STATUS_CONTEXT} (${topic})`,
    description: STATUS_DESCRIPTION[topic][state],
    owner,
    repo,
    sha: commit,
    state,
    target_url: targetUrl
  }

  const octokit = new Octokit({auth: gitHubToken})
  return octokit.request(
    'POST /repos/{owner}/{repo}/statuses/{sha}',
    requestParams
  )
}
