#!/usr/bin/env node
/* eslint-disable no-console */

const webpack = require('webpack')
const ora = require('ora')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

const config = require('../webpack.config.prod')

console.log('🔎  Bundler Analyzer')

// Don't show ugly deprecation warnings that mess with the logging
process.noDeprecation = true

config.plugins.push(new BundleAnalyzerPlugin())
config.plugins.push(new DuplicatePackageCheckerPlugin({
  // Also show module that is requiring each duplicate package
  verbose: true,
  // Emit errors instead of warnings
  emitError: false
}))

const spinner = ora(`Building and analyzing...`).start()
webpack(config).run((error, stats) => {
  if (error) {
    spinner.fail('Error analyzing the build')
    throw new Error(error)
  }

  spinner.succeed('Bundle analyzed successfully')
  const jsonStats = stats.toJson()
  if (stats.hasErrors()) {
    return jsonStats.errors.map(error => console.error(error))
  }

  if (stats.hasWarnings()) {
    jsonStats.warnings.map(warning => console.warn(warning))
  }
})
