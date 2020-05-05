const packageLockStrategy = require('./packageLock')
const shrinkwrapStrategy = require('./shrinkwrap')
/**
 * @param {boolean} packageLockParam flag that indicates that packageLockStrategy should be used
 * @returns {Object}
 */

module.exports = packageLockParam => {
  return packageLockParam ? packageLockStrategy : shrinkwrapStrategy
}
