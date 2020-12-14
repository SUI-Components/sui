const webpack = require('webpack')
const log = require('../shared/log')

module.exports = config => {
  let compiler
  try {
    log.processing('❯ Compiling...')
    compiler = webpack(config)
  } catch (err) {
    log.error(`✖ Failed to compile:\n ${err.message || err}`)
    process.exit(1)
  }

  compiler.hooks.invalid.tap('invalid', () => {
    log.processing('❯ Compiling...')
  })

  compiler.hooks.done.tap('done', stats => {
    const isSuccessful = !stats.hasErrors()

    // Log the correct message of compilation depending if we have warnings
    if (isSuccessful) {
      const {time} = stats.toJson('minimal')
      stats.hasWarnings()
        ? log.warn(`⚠ Compiled with warnings in ${time}ms`)
        : log.success(`✔ Compiled successfully in ${time}ms`)
    }

    // If we have errors, we must show them
    if (!isSuccessful) {
      const messages = console.error(stats.toJson('errors-only', true))
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) messages.errors.length = 1
      // Show the errors
      log.error(`✖ Failed to compile:\n${messages.errors.join('\n\n')}`)
    }

    // With warnings, even after showing the instructions we must list the warnings we have
    if (stats.hasWarnings()) {
      const messages = console.warn(stats.toJson('errors-warnings', true))
      log.warn(messages.warnings.join('\n\n'))
    }
  })

  return compiler
}
