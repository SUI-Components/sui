/* eslint-disable no-console */

const glob = require('fast-glob')
const fs = require('fs-extra')
const {checkAndClean} = require('./utils.js')

const log = console.log

function migrateTestFolders() {
  const files = glob.sync(['test/*/*/index.js'])

  files.forEach(file => {
    const [category, component] = file.replace('/index.js', '').replace('test/', '').split('/')

    const testPath = `./test/${category}/${component}`
    const newTestPath = `./components/${category}/${component}/test`

    // Clean the new path if it already exists.
    checkAndClean(newTestPath)

    fs.moveSync(testPath, newTestPath)
    log(`Moved folder: ${testPath}`)
    fs.moveSync(`${newTestPath}/index.js`, `${newTestPath}/index.test.js`)
    log(`Renamed test file: ${testPath}`)
  })

  fs.removeSync('./test')
  log('Removed test folder not needed anymore')
}

module.exports = migrateTestFolders
