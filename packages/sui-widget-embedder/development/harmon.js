const harmon = require('harmon')

const simpleselect = {}

simpleselect.query = 'head'
simpleselect.func = node => {
  const out = '<script async src="/bundle.js"></script>'
  const rs = node.createReadStream()
  const ws = node.createWriteStream({outer: false})
  rs.pipe(
    ws,
    {end: false}
  )
  rs.on('end', () => {
    ws.end(out)
  })
}

module.exports = harmon([], [simpleselect], true)
