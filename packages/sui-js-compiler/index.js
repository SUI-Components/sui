#!/usr/bin/env node
/* eslint-disable no-console */

'use strict'

const {transformFile} = require('@swc/core')
const program = require('commander')
const fg = require('fast-glob')
const fs = require('fs-extra')
const path = require('path')
const ts = require('typescript')

const compileFile = async file => {
  const {code} = await transformFile(file, {
    configFile: path.resolve(__dirname, '.swcrc')
  })
  const tmp = file.replace('./src', './lib')
  const outputPath = tmp.substr(0, tmp.lastIndexOf('.')) + '.js'

  fs.outputFile(outputPath, code)
}

const compileTypes = (fileNames, options) => {
  const createdFiles = {}
  const host = ts.createCompilerHost(options)
  host.writeFile = (fileName, contents) => (createdFiles[fileName] = contents)

  const program = ts.createProgram(fileNames, options, host)
  program.emit()

  Object.keys(createdFiles).forEach(outputPath => {
    const code = createdFiles[outputPath]
    fs.outputFile(outputPath, code)
  })
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

  const files = await fg('./src/**/*.{js,jsx,ts,tsx}', {ignore})

  await Promise.all(files.map(file => compileFile(file)))

  compileTypes(files, {
    declaration: true,
    emitDeclarationOnly: true,
    incremental: true,
    jsx: 'react-jsx',
    module: 'es6',
    esModuleInterop: true,
    noImplicitAny: false,
    baseUrl: '.',
    outDir: './lib',
    skipLibCheck: true,
    strict: true,
    target: 'es5',
    types: ['react', 'node']
  })

  console.timeEnd('[sui-js-compiler]')
})()
