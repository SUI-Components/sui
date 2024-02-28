const {Match} = require('./Match')
const fg = require('fast-glob')

module.exports.Runner = class Runner {
  static create() {
    return new Runner()
  }

  assertion(key) {
    const files = fg.sync(key, {ignore: ['node_modules'], onlyFiles: false}) ?? []
    return files.map(Match.create)
  }
}
