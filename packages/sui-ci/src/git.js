const {GITHUB_EVENT_PATH, GITHUB_REF = '', TRAVIS_PULL_REQUEST} = process.env

exports.checkIsPullRequest = async () => {
  if (TRAVIS_PULL_REQUEST) {
    // transform string to a Boolean
    return TRAVIS_PULL_REQUEST !== 'false'
  } else {
    const {
      repository: {master_branch: masterBranch}
    } = require(GITHUB_EVENT_PATH)
    const [processBranch] = GITHUB_REF.split('/').reverse()

    return masterBranch !== processBranch
  }
}
