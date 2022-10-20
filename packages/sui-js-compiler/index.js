#!/usr/bin/env node
/* eslint-disable no-console */

'use strict'

import program from 'commander'
import fg from 'fast-glob'
import fs from 'fs-extra'

import {transformFile} from '@swc/core'

import defaultConfig from './swc-config.js'

const compileFile = async file => {
  const {code} = await transformFile(file, defaultConfig)
  const outputPath = file.replace('./src', './lib')
  fs.outputFile(outputPath, code)
}

const commaSeparatedList = value => value.split(',')

program
  .option(
    '--ignore [glob]',
    'List of patterns to ignore during the compilation',
    commaSeparatedList
  )
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-js-compiler')
    console.log('    $ sui-js-compiler ./custom-folder')
    console.log('    $ sui-js-compiler --ignore="./src/**/*Spec.js"')
    console.log('')
  })
  .parse(process.argv)

const {ignore = []} = program.opts()

;(async () => {
  console.time('[sui-js-compiler]')

  const files = await fg('./src/**/*.{js,jsx}', {ignore})
  files.forEach(compileFile)

  console.timeEnd('[sui-js-compiler]')
})()
