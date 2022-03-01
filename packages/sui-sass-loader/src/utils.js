// @ts-check

const fs = require('fs')

const COMMENTS_RULE_MAPS = {
  '//': '\n',
  '/*': '*/'
}

/**
 * Check if argument is an object
 * @param {any} item - The item to check
 * @returns {boolean}
 */
const isObject = item =>
  item && typeof item === 'object' && !Array.isArray(item)

function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {[key]: {}})
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, {[key]: source[key]})
      }
    }
  }

  return mergeDeep(target, ...sources)
}

const utils = {
  fstat(file) {
    try {
      return fs.statSync(file)
    } catch {
      return false
    }
  },
  findComments(text) {
    const ranges = []

    const startRule = /\/\/|\/\*/g
    let matches

    while ((matches = startRule.exec(text))) {
      const endChars = COMMENTS_RULE_MAPS[matches[0]]
      const start = startRule.lastIndex - matches[0].length
      let end = text.indexOf(endChars, startRule.lastIndex)

      if (end < 0) {
        end = Infinity
      }

      ranges.push([start, end])

      startRule.lastIndex = end
    }

    return ranges
  },
  mergeDeep
}

module.exports = utils
