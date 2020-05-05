/**
 * A way to provide descriptive errors easily on a condition
 * @param {any} condition If condition is falsy then we will throw an error
 * @param {String} message The message of the error thrown
 */
export default function(condition, message) {
  if (!condition) throw new Error(message)
  return null
}
