/* eslint-disable no-console */

const glob = require('fast-glob')
const fs = require('fs-extra')

function migrateDemoFolders() {
  const folders = glob.sync(['components/*/*/src/index.js'])

  folders.forEach(file => {
    const [category, component] = file
      .replace('/index.js', '')
      .replace('components/', '')
      .split('/')

    const demoPath = `./demo/${category}/${component}`
    const newDemoPath = `./components/${category}/${component}/demo`

    if (!fs.existsSync(newDemoPath)) {
      fs.moveSync(demoPath, newDemoPath)
      console.log(`Moved folder: ${demoPath}`)
    }
  })

  fs.removeSync('./demo')
  console.log('Removed demo folder not needed anymore')
}

module.exports = migrateDemoFolders
