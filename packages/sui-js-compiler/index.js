#!/usr/bin/env node
/* eslint-disable no-console */

'use strict'

import program from 'commander'
import fg from 'fast-glob'
import fs from 'fs-extra'

import {transformFile} from '@swc/core'

import {getSWCConfig} from './swc-config.js'

const compileFile = async (file, options) => {
  const {code} = await transformFile(file, getSWCConfig(options))
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
  .option('--legacy', 'Transpile using legacy browser targets')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-js-compiler')
    console.log('    $ sui-js-compiler ./custom-folder')
    console.log('    $ sui-js-compiler --ignore="./src/**/*Spec.js"')
    console.log('    $ sui-js-compiler --legacy"')
    console.log('')
  })
  .parse(process.argv)

const {ignore = [], legacy: supportLegacyBrowsers} = program.opts()

;(async () => {
  console.time('[sui-js-compiler]')

  const files = await fg('./src/**/*.{js,jsx}', {ignore})
  files.forEach(file => compileFile(file, {supportLegacyBrowsers}))

  console.timeEnd('[sui-js-compiler]')
})()
