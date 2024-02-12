/* eslint-disable no-console */
import colors from '@s-ui/helpers/colors'

export default {
  info: msg => console.log(colors.gray(msg)),
  error: msg => console.log(colors.red(msg)),
  success: msg => console.log(colors.green(msg)),
  warn: msg => console.log(colors.yellow(msg)),
  processing: msg => console.log(colors.cyan(msg))
}
