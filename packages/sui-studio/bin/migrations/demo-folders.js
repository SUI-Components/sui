/* eslint-disable no-console */

const glob = require('fast-glob')
const fs = require('fs-extra')
const {checkAndClean} = require('./utils')

const ENCODING = 'utf8'
const log = console.log

function replaceImportedPaths(rootPath) {
  const demoFiles = glob.sync([`${rootPath}/**/*.{js,scss}`])

  demoFiles.forEach(file => {
    fs.readFile(file, ENCODING, (err, data) => {
      if (err) return log(err)

      const replacedData = data
        .replace(new RegExp('../../../utils', 'g'), '../../../../utils')
        .replace(
          new RegExp('../../../../components/(.*)/src', 'g'),
          '../../src'
        )

      // Skip writing the file if there's nothing new.
      if (replacedData === data) return

      fs.writeFile(file, replacedData, ENCODING, err => {
        if (err) return log(err)
      })
    })
  })
}

function migrateDemoFolders() {
  const components = glob.sync(['components/*/*/src/index.js'])

  components.forEach(file => {
    const [category, component] = file
      .replace('/index.js', '')
      .replace('components/', '')
      .split('/')
    const demoPath = `./demo/${category}/${component}`
    const newDemoPath = `./components/${category}/${component}/demo`

    // Clean the new path if it already exists
    checkAndClean(newDemoPath)

    fs.moveSync(demoPath, newDemoPath)
    log(`Moved folder: ${demoPath}`)
    replaceImportedPaths(newDemoPath)
    log(`Fixed imported paths`)
  })

  fs.removeSync('./demo')
  log('Removed demo folder not needed anymore')
}

module.exports = migrateDemoFolders
