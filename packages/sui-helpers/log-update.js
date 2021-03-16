const {CI = false} = process.env

const logUpdate = msg => {
  if (CI) return
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
  process.stdout.write(msg)
}

logUpdate.done = msg => {
  if (CI) return console.log(msg)

  logUpdate(msg)
  console.log()
}

module.exports = logUpdate
