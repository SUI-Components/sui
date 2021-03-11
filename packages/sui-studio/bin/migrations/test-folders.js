/* eslint-disable no-console */

const glob = require('fast-glob')
const fs = require('fs-extra')

function migrateTestFolders() {
  const files = glob.sync(['test/*/*/index.js'])

  files.forEach(file => {
    const [category, component] = file
      .replace('/index.js', '')
      .replace('test/', '')
      .split('/')

    const testPath = `./test/${category}/${component}`
    const newTestPath = `./components/${category}/${component}/test`

    if (!fs.existsSync(newTestPath)) {
      fs.moveSync(testPath, newTestPath)
      console.log(`Moved folder: ${testPath}`)
      fs.moveSync(`${newTestPath}/index.js`, `${newTestPath}/index.test.js`)
      console.log(`Renamed test file: ${testPath}`)
    }
  })

  fs.removeSync('./test')
  console.log('Removed test folder not needed anymore')
}

module.exports = migrateTestFolders
