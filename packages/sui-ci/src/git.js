const {command: execute} = require('execa')
const {GITHUB_REF = '', TRAVIS_PULL_REQUEST} = process.env

exports.checkIsPullRequest = async () => {
  if (TRAVIS_PULL_REQUEST) {
    // transform string to a Boolean
    return TRAVIS_PULL_REQUEST !== 'false'
  } else {
    const {stdout: mainOrigin} = await execute(
      'git rev-parse --abbrev-ref origin/HEAD'
    )
    const [, mainBranch] = mainOrigin.split('/')
    const [, , processBranch] = GITHUB_REF.split('/')
    console.log({mainBranch, processBranch})
    return mainBranch === processBranch
  }
}
