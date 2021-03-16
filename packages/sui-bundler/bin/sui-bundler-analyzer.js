#!/usr/bin/env node
/* eslint-disable no-console */

const webpack = require('webpack')
const log = require('../shared/log')
const config = require('../webpack.config.prod')
const {getSpawnPromise} = require('@s-ui/helpers/cli')
const logUpdate = require('@s-ui/helpers/log-update')

const installNeededDependencies = async () => {
  try {
    require('webpack-bundle-analyzer')
    return true
  } catch (e) {
    logUpdate('Installing needed dependencies...')
    return getSpawnPromise('npm', [
      'install',
      '--no-save',
      '--no-optional',
      '--no-audit',
      '--no-fund',
      'webpack-bundle-analyzer@4.3.0 duplicate-package-checker-webpack-plugin@3.0.0'
    ]).then(() => {
      logUpdate.done('Installed needed dependencies')
      getSpawnPromise('./node_modules/.bin/sui-bundler', ['analyzer']).then(
        () => false
      )
    })
  }
}

;(async () => {
  const keepExecution = await installNeededDependencies()
  if (!keepExecution) return

  const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
  const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

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
})()
