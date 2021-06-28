/**
 * A way to provide a warning depending on a condition
 * @param condition If condition is falsy then we will show a warning
 * @param message The message for the logged warning
 */
export default function (condition: boolean, message: string): void {
  if (!condition) console.warn(message) // eslint-disable-line no-console
}
