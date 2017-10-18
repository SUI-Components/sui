#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const rimraf = require('rimraf')
const path = require('path')
const compilerFactory = require('../compiler/production')

const exitWithMsg = msg => { console.log(msg); process.exit(1) }
program
  .option('-C, --clean', 'Remove public folder before create a new one')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Build all widgets statics')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-widget-embedder build')
    console.log('')
  })
  .parse(process.argv)

if (program.clean) {
  console.log('Removing previous build...')
  rimraf.sync(path.resolve(process.cwd(), 'public'))
}

const build = ({page}) => {
  const compiler = compilerFactory({page})
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) { reject(error) }

      const jsonStats = stats.toJson()

      if (stats.hasErrors()) {
        return jsonStats.errors.map(error => console.log(error))
      }

      if (stats.hasWarnings()) {
        console.log('Webpack generated the following warnings: ')
        jsonStats.warnings.map(warning => console.log(warning))
      }

      console.log(`Webpack stats: ${stats}`)
      resolve()
    })
  })
}

Promise.all([
  build({page: 'detail'}),
  build({page: 'list'})
]).catch(err => exitWithMsg(err))
