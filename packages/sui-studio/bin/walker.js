const readdirSync = require('fs').readdirSync
const statSync = require('fs').statSync
const path = require('path')

const onlyFolders = (filePath) => statSync(filePath).isDirectory()
const flatten = (x, y) => x.concat(y)

const cwds = (baseDir) => {
  const rootDir = path.join(baseDir, 'components')

  return readdirSync(rootDir)
    .map(file => path.join(rootDir, file))
    .filter(onlyFolders)
    .map(folder => readdirSync(folder)
      .map(file => path.join(folder, file))
      .filter(onlyFolders)
    ).reduce(flatten, [])
}

module.exports = {
  componentsFullPath: cwds,
  componentsName: (baseDir) => {
    return cwds(baseDir).map(folder => {
      const [component, category] = folder.split('/').reverse()
      return `${category}/${component}`
    })
  }
}
