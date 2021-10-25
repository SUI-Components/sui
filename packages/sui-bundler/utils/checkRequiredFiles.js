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

    console.log('Could not find a required file:')
    console.log(`  Name: ${fileName}`)
    console.log(`  Searched in: ${dirName}`)

    return false
  }
}

module.exports = checkRequiredFiles
