const {extname} = require('path')
const yaml = require('js-yaml')
const fs = require('fs')

module.exports.Match = class Match {
  static create(path) {
    const ext = extname(path)
    if (!ext && fs.statSync(process.cwd() + '/' + path).isDirectory()) {
      return new Match(path, undefined, undefined, true)
    }

    let parsed
    let raw
    switch (ext) {
      case '.json':
        parsed = require(process.cwd() + '/' + path)
        break
      case '.yml':
      case '.yaml':
        parsed = yaml.load(fs.readFileSync(process.cwd() + '/' + path, 'utf8'))
        break
      default:
        raw = fs.readFileSync(process.cwd() + '/' + path, 'utf8')
    }

    return new Match(path, parsed, raw, false)
  }

  constructor(path, parsed, raw, isDir) {
    this.parsed = parsed
    this.raw = raw
    this.path = path
    this.isDir = isDir
    this.fullPath = process.cwd() + '/' + path
  }
}
