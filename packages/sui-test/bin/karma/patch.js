const chalk = require('chalk')

const {write} = process.stdout
process.stdout.write = msg => {
  // Strip + prettify console forwarded output:
  const matches = msg.match(/^LOG ([A-Z]+): ([\s\S]*)$/)
  if (matches) {
    msg =
      chalk.bgBlueBright.white(' ' + matches[1] + ': ') +
      ' ' +
      chalk.blue(matches[2])
  }

  // Strip browser prefix from the output since there's only one:
  if (msg.match(/^[\n\s]*Chrome/)) {
    const color = /\bSUCCESS\b/.test(msg) ? 'greenBright' : 'magenta'
    msg = chalk[color](msg.replace(/^[\n\s]*.*?: /g, ''))
  }

  // Ignore total output since we only have one browser:
  if (msg.match(/\u001b\[32mTOTAL: /)) return // eslint-disable-line no-control-regex

  return write.call(process.stdout, msg)
}
