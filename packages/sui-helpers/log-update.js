const readline = require('readline')
const {CI = false} = process.env

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const logUpdate = msg => {
  if (CI) return
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0)
  rl.write(msg)
}

logUpdate.done = msg => {
  if (CI) return console.log(msg)

  logUpdate(msg)
  console.log()
}

module.exports = logUpdate
