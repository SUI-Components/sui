'use strict'

const path = require('path')

/**
 * Check depth
 * @param {string} filePath - path of the file
 * @param {number} up - number of directories to go up
 * @returns {boolean}
 */
module.exports = (filePath, up) => {
  // components/atom/button
  const depth = path.normalize(filePath).split(path.sep).length - 1
  return depth >= up
}
