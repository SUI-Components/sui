/* eslint-disable no-console */

const glob = require('fast-glob')
const fs = require('fs-extra')
const {checkAndClean} = require('./utils')

const ENCODING = 'utf8'
const log = console.log

function replaceImportedPaths(file) {
  try {
    const data = fs.readFileSync(file, ENCODING)

    const replacedData = data
      .replace(new RegExp('../../../utils', 'g'), 'utils')
      .replace(
        new RegExp('../../../../components/(.*)/src', 'g'),
        'components/$1/src'
      )

    // Skip writing the file if there's nothing new.
    if (replacedData === data) return

    fs.writeFileSync(file, replacedData, ENCODING)
  } catch (error) {
    if (error) return log(error)
  }
}

function flatFile(file) {
  const shouldFlat = file.match('/demo/demo/')

  try {
    if (shouldFlat) {
      const newFilePath = file.replace('demo/demo', 'demo')
      fs.moveSync(file, newFilePath)
    }
  } catch (error) {
    if (error) return log(error)
  }
}

function renameDemoJs(file) {
  const shouldRename = file.match(`/demo.js`)

  try {
    if (shouldRename) {
      const newFileName = file.replace('demo.js', 'index.js')
      fs.renameSync(file, newFileName)
    }
  } catch (error) {
    if (error) return log(error)
  }
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

    const demoFiles = glob.sync([`${newDemoPath}/**/*.{js,scss}`])
    demoFiles.forEach(file => {
      replaceImportedPaths(file) // Fix imported paths
      flatFile(file) // Move /demo/demo/ files to demo/
      renameDemoJs(file) // Rename demo.js to index.js
    })
    log(`Fixed imported paths`)
    log(`Demo folder flattened`)
    log(`demo.js files renamed to index.js`)
  })

  fs.removeSync('./demo')
  log('Removed demo folder not needed anymore')
}

module.exports = migrateDemoFolders
