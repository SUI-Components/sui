/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

class ErrorCommitSaver {
  static initErrorListener (commitMessage) {
    process.on('uncaughtException', function (err) {
      fs.writeFile(path.join(path.resolve(__dirname), 'tmpCommitMessage.txt'), commitMessage, function () {
        console.log(err)
      })
    })
  }

  static retrievePreviousCommit (callback) {
    fs.readFile(path.join(path.resolve(__dirname), 'tmpCommitMessage.txt'), 'utf8', (err, data) => {
      callback(err ? false : data)
    })
  }

  static discardOldCommit () {
    fs.unlink(path.join(path.resolve(__dirname), 'tmpCommitMessage.txt'), () => {})
  }
}
module.exports = ErrorCommitSaver
