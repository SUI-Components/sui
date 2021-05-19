const {promisify} = require('util')
const exec = promisify(require('child_process').exec)
const fetch = require('node-fetch')

const {
  STATUS_CONTEXT,
  STATUS_DESCRIPTION,
  STATUS_STATES
} = require('./constants')

export const getDomain = (url = '') => {
  const [, address] = url.trim().split('@')
  const [domain] = address.split(':')
  return domain
}

/**
 * Get the needed API Base Url depending on the remote origin url
 * @return {Promise<string>} API base url
 */
async function getApiBaseUrl() {
  const {stdout: gitRemoteOriginUrl} = await exec(
    `git config --get remote.origin.url`
  ).catch(() => 'git@github.com:sui/remote-url.git')

  console.log({gitRemoteOriginUrl})

  const domain = getDomain(gitRemoteOriginUrl)

  return domain === 'github.com'
    ? 'https://api.github.com'
    : `https://${domain}/api/v3`
}

/**
 * Create a default description dictionary for a topic
 * @param {string} topic
 * @return {{ [status: string]: string }}
 */
function createDefaultDescriptionDictionary(topic) {
  return {
    [STATUS_STATES.KO]: `Failed ${topic} step`,
    [STATUS_STATES.OK]: `${topic} passed successfully!`,
    [STATUS_STATES.RUN]: `Running ${topic}...`
  }
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

  const descriptionDictionaryForTopic =
    STATUS_DESCRIPTION[topic] || createDefaultDescriptionDictionary(topic)

  const body = JSON.stringify({
    context: `${STATUS_CONTEXT} (${topic})`,
    description: descriptionDictionaryForTopic[state],
    state,
    target_url: targetUrl
  })

  return fetch(`${baseUrl}/repos/${owner}/${repo}/statuses/${commit}`, {
    body,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${gitHubToken}`
    },
    method: 'POST'
  })
}
