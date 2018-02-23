/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')
const os = require('os')

/**
 * ErrorCommitSaver is the module that have the ownership of save and retrieve old commit messages if there was an exception on the operation.
 */
class ErrorCommitSaver {
  /**
   * The initErrorListener will subscribe to the event uncaughtException and add the callback that will add a file with the commitMessage
   * on our OS TMP folder.
   *
   * @param {string} commitMessage The commit message string well formatted.
   */
  static initErrorListener (commitMessage) {
    process.on('uncaughtException', function (err) {
      fs.writeFile(path.join(os.tmpdir(), 'tmpCommitMessage.txt'), commitMessage, function () {
        console.log(err)
      })
    })
  }

  /**
   * retrievePreviousCommit will check if there's an existing old commit file and will get it's content calling a callback with the commitMessage.
   * @param {function} callback
   */
  static retrievePreviousCommit (callback) {
    fs.readFile(path.join(os.tmpdir(), 'tmpCommitMessage.txt'), 'utf8', (err, commitMessage) => {
      callback(err ? false : commitMessage)
    })
  }

  /**
   * discardOldCommit will check for the oldCommit file and will remove it
   */
  static discardOldCommit () {
    fs.unlink(path.join(os.tmpdir(), 'tmpCommitMessage.txt'), () => {})
  }
}
module.exports = ErrorCommitSaver
