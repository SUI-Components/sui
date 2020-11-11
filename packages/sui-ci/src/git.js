const {command: execute} = require('execa')
const {GITHUB_REF = '', TRAVIS_PULL_REQUEST} = process.env

exports.checkIsPullRequest = async () => {
  if (TRAVIS_PULL_REQUEST) {
    // transform string to a Boolean
    return TRAVIS_PULL_REQUEST !== 'false'
  } else {
    const {stdout: mainOrigin} = await execute(
      'git symbolic-ref refs/remotes/origin/HEAD'
    )
    const [mainBranch] = mainOrigin.split('/').reverse()
    const [processBranch] = GITHUB_REF.split('/').reverse()
    return mainBranch !== processBranch
  }
}
