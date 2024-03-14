#!/usr/bin/env node
/* eslint-disable no-console */
// https://github.com/coryhouse/react-slingshot/blob/master/tools/build.js
const program = require('commander')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const {showError, showWarning} = require('@s-ui/helpers/cli')
const {getPackageJson} = require('@s-ui/helpers/packages')
const config = require('../webpack.config.lib.js')
const log = require('../shared/log.js')

program
  .usage('[options] <entry>')
  .option('-C, --clean', 'Remove previous build folder before create a new one')
  .option('-o, --output [output]', 'Bundle folder path')
  .option('-u, --umd [libraryName]', 'Whether to output library as umb')
  .option('-r, --root', 'Create build in root dir instead of version subdir')
  .option('-p, --path [path]', 'Absolute public path where files will be located.')
  .option('--chunk-css', 'Bundle css in chunks')
  .on('--help', () =>
    console.log(`Examples:
      $ sui-bundler lib src/index.js -o umd/my-lib -p http://my-cdn.com/my-lib -C'
      $ sui-bundler lib --help'
  `)
  )
  .parse(process.argv)

const [entry] = program.args
const options = program.opts()
const {clean = false, output, umd = false, root = false, chunkCss = false} = options
const publicPath = options.path

if (!output) {
  showError(new Error('--output is mandatory.'), program)
}

if (!entry) {
  showError(new Error('Please provide an entry file path.'), program)
}

if (!publicPath) {
  showWarning('--path option is required for the chuncks to work.')
}

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const version = getPackageJson(process.cwd()).version
const outputFolder = path.join(process.cwd(), output, path.sep, root ? '' : version)
const webpackConfig = {...config({chunkCss}), entry: path.resolve(process.cwd(), entry)}
webpackConfig.output.publicPath = publicPath + (root ? '' : version + '/')
webpackConfig.output.path = outputFolder

if (umd) {
  webpackConfig.output.library = umd
  webpackConfig.output.libraryTarget = 'umd'
}

if (clean) {
  log.processing(`Removing previous build in ${output}...`)
  fs.rmSync(outputFolder, {force: true, recursive: true})
}

log.processing('Generating minified bundle...')

webpack(webpackConfig).run((error, stats) => {
  if (error) {
    showError(error, program)
    process.exit(1)
  }

  if (stats.hasErrors()) {
    const jsonStats = stats.toJson('errors-warnings')
    jsonStats.errors?.forEach(error => log.error(error.message))
    process.exit(1)
  }

  if (stats.hasWarnings()) {
    const jsonStats = stats.toJson('errors-warnings')
    jsonStats.warnings?.forEach(warning => log.warn(warning.message))
  }

  if (stats.hasErrors() || stats.hasWarnings()) {
    const jsonStats = stats.toJson('errors-warnings')
    jsonStats.warnings.map(log.warn)
    jsonStats.errors.map(log.error)
  }

  console.log(`Webpack stats: ${stats}`)
  log.success(`Your library is compiled in production mode in: \n${outputFolder}`)
})
