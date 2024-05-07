const path = require('node:path')
const fg = require('fast-glob')

let instance

class MonoRepo {
  static create(root) {
    if (instance) return instance

    return new MonoRepo(root)
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

  isPackage(filePath, relativeImport) {
    if (!relativeImport.startsWith('../')) return false

    const pkgName = path
      .normalize(path.dirname(filePath) + '/' + relativeImport)
      ?.replace(this.root, '')
      ?.replace(/(lib|src)\/.*/, 'package.json')
      ?.replace('/', '')

    return this.packages.includes(pkgName)
  }
}

module.exports.Monorepo = MonoRepo
