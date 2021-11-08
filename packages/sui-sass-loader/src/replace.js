const async = require('async')

/**
 * Replace string asynchronously
 *
 * @param  {String} text        text to replace
 * @param  {RegExp} rule        RegExp
 * @param  {Function} replacer  function that return promise
 * @return {String}
 */
function replaceAsync(text, rule, replacer) {
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

  return new Promise((resolve, reject) => {
    async.mapSeries(
      ranges,
      function(range, done) {
        replacer
          .apply(
            {
              start: range[0],
              end: range[1]
            },
            range[2]
          )
          .then(
            ret => {
              done(null, ret)
            },
            err => {
              done(err)
            }
          )
      },
      function(err, results) {
        err ? reject(err) : resolve(replaceByRanges(text, ranges, results))
      }
    )
  })
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
