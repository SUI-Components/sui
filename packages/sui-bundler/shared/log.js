/* eslint-disable no-console */

const chalk = require('chalk')

module.exports = {
  info: msg => console.log(chalk.white(msg)),
  error: msg => console.log(chalk.red(msg)),
  success: msg => console.log(chalk.green(msg)),
  warn: msg => console.log(chalk.yellow(msg)),
  processing: msg => console.log(chalk.blue(msg))
}
