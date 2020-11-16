/* eslint no-console:0 */
// Generate scoped entries on node
const task = i => {
  i *= 1000000
  while (i > 0) i--
}
const asyncTask = time => new Promise(resolve => setTimeout(resolve, time))

export default ({mark, stop, measure, getEntries}) => {
  mark('Example 1 - async')
  const promise = asyncTask(100)
    .then(() => stop('Example 1 - async'))
    .then(() => console.log(getEntries()))

  mark('Example 1 - sync')
  task(1000)
  stop('Example 1 - sync')

  return promise
}
