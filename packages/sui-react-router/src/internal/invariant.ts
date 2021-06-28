/**
 * A way to provide descriptive errors easily on a condition
 * @param condition If condition is falsy then we will throw an error
 * @param message The message of the error thrown
 */
export default function (condition: boolean, message: string): null {
  if (!condition) throw new Error(message)
  return null
}
