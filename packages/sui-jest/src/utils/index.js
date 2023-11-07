const path = require('path')
const fs = require('fs')
const readPkgUp = require('read-pkg-up')

const {path: pkgPath} = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd())
})

const appDirectory = path.dirname(pkgPath)

const fromRoot = (...p) => path.join(appDirectory, ...p)

const hasFile = (...p) => fs.existsSync(fromRoot(...p))

module.exports = {
  appDirectory,
  fromRoot,
  hasFile
}
