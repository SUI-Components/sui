#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const rimraf = require('rimraf')
const path = require('path')
const archive = require('../archive')
require('colors')

const pkg = require(path.join(process.cwd(), 'package.json'))
const REMOVE_ZIP_PATH = path.join(process.cwd(), '*-sui-ssr.zip')

program
  .option('-C, --clean', 'Remove previous zip')
  .option(
    '-R, --docker-registry <dockerRegistry>',
    'Custom registry to be used as a proxy or instead of the Docker Hub registry'
  )
  .option(
    '-E, --entry-point <entryPoint>',
    'Relative path to an entry point script to replace the current one -> https://bit.ly/3e4wT8C'
  )
  .option(
    '-A, --auth <auth>',
    'A string based on username:password that will be used in order to log-in inside our website'
  )
  .option(
    '-O, --outputFileName <outputFileName>',
    'A string that will be used to set the name of the output filename. Keep in mind that the outputFilename will have the next suffix <outputFileName>-sui-ssr.zip'
  )
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Build a server.zip ready to be upload to a lambda function')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-ssr archive')
    console.log('')
    console.log('')
    console.log('')
    console.log('    $ sui-ssr archive --auth="foo:bar"')
    console.log('')
  })
  .parse(process.argv)

if (program.clean) {
  // console.log(' -> Removing ALL previous zip files 🗑 ...'.yellow.bold)
  rimraf.sync(REMOVE_ZIP_PATH)
  // console.log(' -> Removed! ✅'.green.bold)
}

let entryPoint
let dockerRegistry = ''

if (program.entryPoint) entryPoint = path.resolve(program.entryPoint)
if (program.dockerRegistry) dockerRegistry = `${program.dockerRegistry}/`

const outputFileName = program.outputFileName
const OUTPUT_ZIP_PATH = path.join(
  process.cwd(),
  `${outputFileName}-sui-ssr.zip`
)
;(async () => {
  // console.log(' -> Compressing files... 🗄'.yellow)
  await archive({
    outputZipPath: OUTPUT_ZIP_PATH,
    pkg,
    entryPoint,
    dockerRegistry
  })
})()
