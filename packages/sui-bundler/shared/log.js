/* eslint-disable no-console */
const colors = require('@s-ui/helpers/colors')

module.exports = {
  info: msg => console.log(colors.gray(msg)),
  error: msg => console.log(colors.red(msg)),
  success: msg => console.log(colors.green(msg)),
  warn: msg => console.log(colors.yellow(msg)),
  processing: msg => console.log(colors.cyan(msg))
}
