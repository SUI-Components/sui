#!/usr/bin/env node
/* eslint-disable no-console */

'use strict'

import program from 'commander'
import fg from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'
import ts from 'typescript'

import {transformFile} from '@swc/core'

import {getSWCConfig} from './swc-config.js'

const tsConfigPath = path.join(process.cwd(), 'tsconfig.json')
let tsConfigData
let isTypeScriptEnabled = false

try {
  if (fs.existsSync(tsConfigPath)) {
    tsConfigData = JSON.parse(fs.readFileSync(tsConfigPath, {encoding: 'utf8'}))
    isTypeScriptEnabled = true
  }
} catch (err) {
  console.error(err)
}

const compileFile = async (file, options) => {
  const {code} = await transformFile(file, getSWCConfig(options))
  const outputPath = file.replace('./src', './lib')

  fs.outputFile(outputPath, code)
}

const compileFiles = files => {
  return Promise.all(file => compileFile(file, {isModern}))
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
  .option('--modern', 'Transpile using modern browser targets')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-js-compiler')
    console.log('    $ sui-js-compiler ./custom-folder')
    console.log('    $ sui-js-compiler --ignore="./src/**/*Spec.js"')
    console.log('    $ sui-js-compiler --modern"')
    console.log('')
  })
  .parse(process.argv)

const {ignore = [], modern: isModern} = program.opts()

;(async () => {
  console.time('[sui-js-compiler]')

  const files = await fg('./src/**/*.{js,jsx,ts,tsx}', {ignore})

  await Promise.all([
    compileFiles(files),
    isTypeScriptEnabled
      ? compileTypes(files, {
          ...{
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
          },
          ...(tsConfigData?.compilerOptions ?? {})
        })
      : Promise.resolve()
  ])

  console.timeEnd('[sui-js-compiler]')
})()
