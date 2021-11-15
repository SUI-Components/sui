const readline = require('readline')
const {CI = false} = process.env

const logUpdate = msg => {
  if (CI) return

  const blank = '\n'.repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
  console.log(msg)
}

logUpdate.done = msg => {
  if (CI) return console.log(msg)

  logUpdate(msg)
  console.log()
}

module.exports = logUpdate
