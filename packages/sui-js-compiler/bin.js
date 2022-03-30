#!/usr/bin/env node

import program from 'commander'
import fg from 'fast-glob'
import {compileAndOutputFile} from './index.js'

const commaSeparatedList = value => value.split(',')

program
  .option('--cwd <path>', 'Current working directory', process.cwd())
  .option(
    '--ignore [glob]',
    'List of patterns to ignore during the compilation',
    commaSeparatedList
  )
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-js-compiler')
    console.log('    $ sui-js-compiler --ignore="./src/**/*Spec.js"')
    console.log('')
  })
  .parse(process.argv)

const {cwd, ignore = []} = program.opts()

console.time('[sui-js-compiler]')
const files = await fg('./src/**/*.{js,jsx}', {cwd, ignore})
files.forEach(compileAndOutputFile)
console.timeEnd('[sui-js-compiler]')
