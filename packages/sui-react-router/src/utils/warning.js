/**
 * A way to provide a warning depending on a condition
 * @param {Boolean} condition If condition is falsy then we will show a warning
 * @param {String} message The message for the logged warning
 */
export default function(condition, message) {
  if (!condition) console.warn(message) // eslint-disable-line no-console
}
