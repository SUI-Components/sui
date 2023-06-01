const {DEBUG} = process.env

/**
 * Show logging information if debug mode is enabled
 * @param {...any} args - arguments to log
 * @returns {void}
 */

module.exports = function (...args) {
  DEBUG && console.log('[copyfiles] ', ...args)
}
