import {readFile} from 'fs/promises'

const {
  GITHUB_EVENT_PATH,
  GITHUB_REF = '',
  GITHUB_SHA = '',
  TRAVIS_COMMIT,
  TRAVIS_PULL_REQUEST,
  TRAVIS_PULL_REQUEST_SHA
} = process.env

/**
 * Get GitHub global event object used on GitHub Actions
 * @return {object}
 */
const getGitHubEvent = async () => {
  try {
    console.log(GITHUB_EVENT_PATH)
    const file = await readFile(GITHUB_EVENT_PATH, 'utf-8')
    console.log('content of file')
    console.log(file)
    return JSON.parse(file)
  } catch (e) {
    console.error('something wrong happened:')
    console.error(e)
    return {}
  }
}

/**
 * Get the latest commit sha depending on the CI system used
 * @return {string}
 */
export const getCommitSha = async () => {
  // For Travis, we try to get the sha from Pull Request and fallback to commit from master
  const commitFromTravis = TRAVIS_PULL_REQUEST_SHA || TRAVIS_COMMIT
  if (commitFromTravis) return commitFromTravis

  // For GitHub Actions, extract from the GitHub global event for pullRequest
  const {pull_request: pullRequest} = await getGitHubEvent()
  try {
    // try from pullRequest and fallback to branch latest sha
    return pullRequest.head.sha
  } catch {
    return GITHUB_SHA
  }
}

/**
 * Determine if we're on a pull request supporting different CI systems
 * @return {boolean}
 */
export const checkIsPullRequest = () => {
  // For Travis we need to transform string to a Boolean
  if (TRAVIS_PULL_REQUEST) return TRAVIS_PULL_REQUEST !== 'false'

  // For GitHub Actions, we extract that info from GitHub global event
  const {
    repository: {master_branch: masterBranch}
  } = getGitHubEvent()
  const [processBranch] = GITHUB_REF.split('/').reverse()
  // if the master branch from the github event is different as the branch used
  // then we're on a pull request
  return masterBranch !== processBranch
}
