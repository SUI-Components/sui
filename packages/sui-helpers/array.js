/**
 * Split an array in chunks
 * @param {Array} array Array to split
 * @param {Number} chunk Number of elements by chunk
 */
function splitArray(array, chunk = 10) {
  const j = array.length
  const temparray = []
  let i = 0
  for (i; i < j; i += chunk) {
    temparray.push(array.slice(i, i + chunk))
  }
  return temparray
}

module.exports = {splitArray}
