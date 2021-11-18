/**
 * Replace string asynchronously
 *
 * @param  {String} text        text to replace
 * @param  {RegExp} rule        RegExp
 * @param  {Function} replacer  function that return promise
 * @return {String}
 */
async function replaceAsync(text, rule, replacer) {
  let matches
  const ranges = []

  rule.lastIndex = 0

  while ((matches = rule.exec(text))) {
    ranges.push([
      rule.lastIndex - matches[0].length,
      rule.lastIndex,
      matches.slice()
    ])
  }

  const results = []
  for (const range of ranges) {
    const [start, end, matches] = range
    const result = await replacer.apply({start, end}, matches)
    results.push(result)
  }
  return replaceByRanges(text, ranges, results)
}

function replaceByRanges(text, ranges, replaces) {
  const points = [0]
  const map = {}
  const pieces = []

  ranges.forEach((range, i) => {
    points.push(range[0])
    points.push(range[1])

    map[`${range[0]}-${range[1]}`] = replaces[i] || ''
  })

  points.push(Infinity)

  while (points.length > 1) {
    const start = points.shift()
    const [stop] = points
    const key = `${start}-${stop}`

    const el = key in map ? map[key] : text.substring(start, stop)
    pieces.push(el)
  }

  return pieces.join('')
}

module.exports = replaceAsync
