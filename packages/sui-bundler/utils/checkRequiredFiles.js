const fs = require('fs')
const path = require('path')

function checkRequiredFiles(files) {
  let currentFilePath
  try {
    files.forEach(filePath => {
      currentFilePath = filePath
      fs.accessSync(filePath, fs.F_OK)
    })
    return true
  } catch (err) {
    const dirName = path.dirname(currentFilePath)
    const fileName = path.basename(currentFilePath)
    console.log('Could not find a required file.')
    console.log('  Name: ') + chalk.cyan(fileName)
    console.log('  Searched in: ') + chalk.cyan(dirName)
    return false
  }
}

module.exports = checkRequiredFiles
