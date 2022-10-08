import packageLockStrategy from './packageLock.js'
import shrinkwrapStrategy from './shrinkwrap.js'
/**
 * @param {boolean} packageLockParam flag that indicates that packageLockStrategy should be used
 * @returns {Object}
 */

export default packageLockParam => {
  return packageLockParam ? packageLockStrategy : shrinkwrapStrategy
}
