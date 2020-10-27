#!/usr/bin/env node
/* eslint-disable no-console */

const webpack = require('webpack')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const log = require('../shared/log')
const config = require('../webpack.config.prod')

config.plugins.push(new BundleAnalyzerPlugin())
config.plugins.push(
  new DuplicatePackageCheckerPlugin({
    verbose: true, // Show module that is requiring each duplicate package
    emitError: false // Avoid emit errors, just a warning
  })
)

log.processing('🔎 Analyzing Bundle...\n')
webpack(config).run((error, stats) => {
  if (error) {
    log.error('Error analyzing the build')
    throw new Error(error)
  }

  log.success('Bundle analyzed successfully')

  if (stats.hasErrors() || stats.hasWarnings()) {
    const jsonStats = stats.toJson('errors-warnings')
    jsonStats.warnings.map(log.warn)
    jsonStats.errors.map(log.error)
  }
})
