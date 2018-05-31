/* eslint-disable no-console */

const ErrorCommitSaver = require('./ErrorCommitSaver')
const PrompterManager = require('./PrompterManager')

module.exports = {
  prompter: function(cz, commit) {
    ErrorCommitSaver.retrievePreviousCommit(commitString => {
      const actionToPerform = commitString
        ? 'startRecoverOldCommitFlow'
        : 'startMainCommitFlow'
      PrompterManager[actionToPerform](cz, commit, commitString)
    })
  }
}
