#!/usr/bin/env node
/* eslint-disable no-console */
// https://github.com/coryhouse/react-slingshot/blob/master/tools/build.js
const program = require('commander')
const rimraf = require('rimraf')
const webpack = require('webpack')
const {getPackageJson} = require('@s-ui/helpers/packages')
const path = require('path')
const config = require('../webpack.config.lib')
const {showError, showWarning} = require('@s-ui/helpers/cli')
const chalk = require('chalk')

const showSuccess = msg => console.log(chalk.green(msg))
const showInfo = msg => console.log(chalk.blue(msg))

program
  .usage('[options] <entry>')
  .option('-C, --clean', 'Remove previous build folder before create a new one')
  .option('-o, --output [output]', 'Bundle folder path')
  .option('-u, --umd [libraryName]', 'Whether to output library as umb')
  .option('-r, --root', 'Create build in root dir instead of version subdir')
  .option(
    '-p, --path [path]',
    'Absolute public path where files will be located.'
  )
  .on('--help', () =>
    console.log(`Examples:
      $ sui-bundler lib src/index.js -o umd/my-lib -p http://my-cdn.com/my-lib -C'
      $ sui-bundler lib --help'
  `)
  )
  .parse(process.argv)

const {
  clean = false,
  output,
  umd = false,
  path: publicPath,
  args: [entry],
  root = false
} = program

if (!output) {
  showError(new Error('--output is mandatory.'), program)
}

if (!entry) {
  showError(new Error('Please provide an entry file path.'), program)
}

if (!publicPath) {
  showWarning('--path option is required for the chuncks to work.', program)
}

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const version = getPackageJson(process.cwd()).version
const outputFolder = path.join(
  process.cwd(),
  output,
  path.sep,
  root ? '' : version
)
const webpackConfig = Object.assign({}, config, {
  entry: path.resolve(process.cwd(), entry)
})
webpackConfig.output.publicPath = publicPath + (root ? '' : version + '/')
webpackConfig.output.path = outputFolder

if (umd) {
  webpackConfig.output.library = umd
  webpackConfig.output.libraryTarget = 'umd'
}

if (clean) {
  showInfo(`Removing previous build in ${output}...`)
  rimraf.sync(outputFolder)
}

showInfo('Generating minified bundle. This will take a moment...')
webpack(webpackConfig).run((error, stats) => {
  if (error) {
    showError(error, program)
    return 1
  }

  const jsonStats = stats.toJson()

  if (stats.hasErrors()) {
    return jsonStats.errors.map(showError)
  }

  if (stats.hasWarnings()) {
    showWarning('Webpack generated the following warnings: ')
    jsonStats.warnings.map(showWarning)
  }

  console.log(`Webpack stats: ${stats}`)
  showSuccess(
    `Your library is compiled in production mode in: \n${outputFolder}`
  )

  return 0
})
