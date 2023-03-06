#!/usr/bin/env node
/* eslint-disable no-console */

'use strict'

import program from 'commander'
import fg from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'
import ts from 'typescript'

import {transformFile} from '@swc/core'

const compileFile = async file => {
  const {code} = await transformFile(file, {
    configFile: path.resolve(__dirname, '.swcrc')
  })
  const tmp = file.replace('./src', './lib')
  const outputPath = tmp.substr(0, tmp.lastIndexOf('.')) + '.js'

  return fs.outputFile(outputPath, code)
}

const compileFiles = files => {
  return Promise.all(files.map(compileFile))
}

const compileTypes = (files, options) => {
  const createdFiles = {}
  const host = ts.createCompilerHost(options)
  host.writeFile = (fileName, contents) => (createdFiles[fileName] = contents)

  const program = ts.createProgram(files, options, host)
  program.emit()

  return Promise.all(
    Object.keys(createdFiles).map(outputPath => {
      const code = createdFiles[outputPath]
      return fs.outputFile(outputPath, code)
    })
  )
}

const commaSeparatedList = value => value.split(',')

program
  .option(
    '--ignore [glob]',
    'List of patterns to ignore during the compilation',
    commaSeparatedList
  )
  .option('--ts', 'Enable TypeScript Compiler')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-js-compiler')
    console.log('    $ sui-js-compiler ./custom-folder')
    console.log('    $ sui-js-compiler --ignore="./src/**/*Spec.js"')
    console.log('')
  })
  .parse(process.argv)

const {ignore = [], ts: isTypeScriptEnabled = false} = program.opts()

;(async () => {
  console.time('[sui-js-compiler]')

  const files = await fg('./src/**/*.{js,jsx,ts,tsx}', {ignore})

  await Promise.all([
    compileFiles(files),
    isTypeScriptEnabled
      ? compileTypes(files, {
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
      : Promise.resolve()
  ])

  console.timeEnd('[sui-js-compiler]')
})()
