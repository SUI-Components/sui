const readdirSync = require('fs').readdirSync
const statSync = require('fs').statSync
const path = require('path')

const {PWD} = process.env

const onlyFolders = filePath => statSync(filePath).isDirectory()
const filterNodeModulesFolder = path => !path.endsWith('node_modules')
const flatten = (x, y) => x.concat(y)

const getComponentsPath = (baseDir = PWD) => {
  const rootDir = path.join(baseDir, 'components')

  return readdirSync(rootDir)
    .map(file => path.join(rootDir, file))
    .filter(onlyFolders)
    .filter(filterNodeModulesFolder)
    .filter(a => !a.endsWith('node_modules'))
    .map(folder =>
      readdirSync(folder)
        .map(file => path.join(folder, file))
        .filter(onlyFolders)
    )
    .reduce(flatten, [])
}

const getComponentsNames = (baseDir = PWD) =>
  getComponentsPath(baseDir).map(folder => {
    const [component, category] = folder.split(path.sep).reverse()
    return `${category}/${component}`
  })

module.exports = {
  getComponentsPath,
  getComponentsNames
}
