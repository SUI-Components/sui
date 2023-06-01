'use strict'

const path = require('path')
const checkDepth = require('./checkDepth.js')

/**
 * Resolve file path
 * @param {string} filePath - path of the file
 * @param {object} config - configuration object
 * @param {object} config.flatten - flatten the path
 * @param {number} config.up - number of directories to go up
 * @returns {string}
 */
module.exports = (filePath, {flatten, up}) => {
  if (flatten === true) return path.basename(filePath)
  if (up === 0) return filePath

  if (!checkDepth(filePath, up)) {
    throw new Error(
      "The number of folders you're trying to go up are not correct. Check the path or the up config"
    )
  }

  return path.join(...path.normalize(filePath).split(path.sep).slice(up))
}
