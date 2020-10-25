const webpack = require('webpack')
const clearConsole = require('react-dev-utils/clearConsole')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const log = require('../shared/log')

const isInteractive = process.stdout.isTTY

const printInstructions = ({urls}) =>
  log.info(`
  Local:    ${urls.localUrlForTerminal}
  Network:  ${urls.lanUrlForTerminal}
`)

module.exports = (config, urls) => {
  let compiler
  try {
    compiler = webpack(config)
  } catch (err) {
    log.error(`✖ Failed to compile:\n ${err.message || err}`)
    process.exit(1)
  }

  compiler.hooks.invalid.tap('invalid', () => {
    if (isInteractive) clearConsole()
    log.processing('❯ Compiling...')
  })

  compiler.hooks.done.tap('done', stats => {
    if (isInteractive) clearConsole()

    const isSuccessful = !stats.hasErrors()

    // Log the correct message of compilation depending if we have warnings
    if (isSuccessful) {
      stats.hasWarnings()
        ? log.warn('⚠ Compiled with warnings')
        : log.success('✔ Compiled successfully')
    }

    // Even with warnings, we show instructions to access localhost if we have a compilation
    if (isSuccessful && isInteractive) printInstructions({urls})

    // If we have errors, we must show them
    if (!isSuccessful) {
      const messages = formatWebpackMessages(stats.toJson('errors-only', true))
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) messages.errors.length = 1
      // Show the errors
      log.error(`✖ Failed to compile:\n${messages.errors.join('\n\n')}`)
    }

    // With warnings, even after showing the instructions we must list the warnings we have
    if (stats.hasWarnings()) {
      const messages = formatWebpackMessages(
        stats.toJson('errors-warnings', true)
      )
      log.warn(messages.warnings.join('\n\n'))
    }
  })

  return compiler
}
