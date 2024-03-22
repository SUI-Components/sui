const {Match} = require('./Match')
const fastGlob = require('fast-glob')

module.exports.Runner = class Runner {
  static create(fg) {
    return new Runner(fg ?? fastGlob)
  }

  constructor(fg) {
    this.fg = fg
  }

  assertion(key) {
    const files = this.fg.sync(key, {ignore: ['node_modules'], onlyFiles: false}) ?? []
    return files.map(Match.create)
  }
}
