const path = require('node:path')
const fg = require('fast-glob')

let instance

class MonoRepo {
  static create(root) {
    if (instance) return instance

    instance = new MonoRepo(root)
    return instance
  }

  constructor(root) {
    const rootPackageJSON = require(path.join(root, 'package.json'))
    const innerPatternPackagesJSON = rootPackageJSON.workspaces?.map(workspace => path.join(workspace, 'package.json'))
    this._packages = innerPatternPackagesJSON ? fg.sync(innerPatternPackagesJSON, {deep: 3}) : []
    this._root = root
  }

  get packages() {
    return this._packages
  }

  get root() {
    return this._root
  }

  belongSamePackage(filePath, relativeImport) {
    return (
      path.normalize(filePath)?.replace(this.root, '')?.split('/')?.at(1) ===
      path
        .normalize(path.dirname(filePath) + '/' + relativeImport)
        ?.replace(this.root, '')
        ?.split('/')
        ?.at(1)
    )
  }

  isPackage(filePath, relativeImport) {
    if (!relativeImport.startsWith('../')) return false
    if (this.belongSamePackage(filePath, relativeImport)) return false

    const pkgName = path
      .normalize(path.dirname(filePath) + '/' + relativeImport)
      ?.replace(this.root, '')
      ?.replace(/(lib|src)\/.*/, 'package.json')
      ?.replace('/', '')

    return this.packages.includes(pkgName)
  }
}

module.exports.Monorepo = MonoRepo
