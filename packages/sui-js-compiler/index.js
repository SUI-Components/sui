#!/usr/bin/env node

'use strict'

const {transformFile} = require('@swc/core')
const program = require('commander')
const fg = require('fast-glob')
const fs = require('fs-extra')
const defaultConfig = require('./swc-config.js')

const compileFile = async file => {
  const {code} = await transformFile(file, defaultConfig)
  const outputPath = file.replace('./src', './lib')
  fs.outputFile(outputPath, code)
}

const commaSeparatedList = value => value.split(',')

const DEFAULT_SRC = './src/**/*.{js,jsx}'

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
const pattern = program.args[0] || DEFAULT_SRC

;(async () => {
  console.time('[sui-js-compiler]')

  const files = await fg(pattern, {ignore})
  files.forEach(compileFile)

  console.timeEnd('[sui-js-compiler]')
})()
