const {extname} = require('path')
const yaml = require('js-yaml')
const fs = require('fs')

class CustomFileReader {
  static create() { return new CustomFileReader() } // eslint-disable-line

  isDirectory(path) { return fs.statSync(process.cwd() + '/' + path).isDirectory() } // eslint-disable-line
  parseYML(path) { return yaml.load(fs.readFileSync(process.cwd() + '/' + path, 'utf8')) } // eslint-disable-line
  parseJSON(path) { return require(process.cwd() + '/' + path) } // eslint-disable-line
  raw(path) { return fs.readFileSync(process.cwd() + '/' + path, 'utf8') } // eslint-disable-line
}

class Match {
  static empty() {
    return new Match(undefined, undefined, undefined, false)
  }

  static create(path) {
    const ext = extname(path)
    if (!ext && CustomFileReader.create().isDirectory(path)) {
      return new Match(path, undefined, undefined, true)
    }

    let parsed
    let raw
    switch (ext) {
      case '.json':
        parsed = CustomFileReader.create().parseJSON(path)
        break
      case '.yml':
      case '.yaml':
        parsed = CustomFileReader.create().parseYML(path)
        break
      default:
        raw = CustomFileReader.create().raw(path)
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

module.exports.CustomFileReader = CustomFileReader
module.exports.Match = Match
