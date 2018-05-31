/* eslint no-console:0 */
export function warn(msg, ...args) {
  return (
    console &&
    console.warn &&
    console.warn.apply(console, ['WARN LOG:', msg].concat(args))
  )
}
