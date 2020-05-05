const packageLockStrategy = require('./packageLock')
const shrinkwrapStrategy = require('./shrinkwrap')

module.exports = {
  /**
   * @param {boolean} packageLockParam flag that indicates that packageLockStrategy should be used
   * @returns {Object}
   */
  strategyFactory: packageLockParam => {
    return packageLockParam ? packageLockStrategy : shrinkwrapStrategy
  }
}
