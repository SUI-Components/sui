/* eslint-disable no-console */

const fs = require('fs-extra')

const log = console.log

function checkAndClean(path) {
  if (fs.existsSync(path)) {
    try {
      fs.rmdirSync(path, {recursive: true})

      log(`${path} has been deleted!`)
    } catch (err) {
      log(err)
    }
  }
}

module.exports = {checkAndClean}
