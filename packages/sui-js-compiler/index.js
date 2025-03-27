#!/usr/bin/env node
/* eslint-disable no-console */

'use strict'

import program from 'commander'
import fg from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'

import {transformFile} from '@swc/core'

import {getSWCConfig} from '@s-ui/compiler-config'

const SOURCE_DIR = './src'
const OUTPUT_DIR = './lib'
const TS_EXTENSION_REGEX = /(\.ts)x?/
const COMPILED_EXTENSION = '.js'
const DEFAULT_TS_CONFIG = {
  declaration: true,
  emitDeclarationOnly: true,
  incremental: true,
  jsx: 'react-jsx',
  module: 'es6',
  esModuleInterop: true,
  noImplicitAny: false,
  baseUrl: '.',
  outDir: OUTPUT_DIR,
  skipLibCheck: true,
  strict: true,
  target: 'es5',
  types: ['react', 'node']
}

const getTsConfig = () => {
  // Get TS config from the package dir.
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json')
  let tsConfig

  try {
    if (fs.existsSync(tsConfigPath)) {
      tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, {encoding: 'utf8'}))
    }
  } catch (err) {
    console.error(err)
  }

  return tsConfig
}

const compileFile = async (file, options) => {
  const {code} = await transformFile(file, getSWCConfig(options))
  const outputPath = file.replace(SOURCE_DIR, OUTPUT_DIR).replace(TS_EXTENSION_REGEX, COMPILED_EXTENSION)

  await fs.outputFile(outputPath, code)
}

const compileTypes = async (files, options) => {
  const ts = await import('typescript').then(module => module.default)
  const createdFiles = {}

  const parsedCommandLine = ts.parseJsonConfigFileContent({compilerOptions: options}, ts.sys, process.cwd())

  const host = ts.createCompilerHost(parsedCommandLine.options)
  host.writeFile = (fileName, contents) => (createdFiles[fileName] = contents)

  const program = ts.createProgram(files, parsedCommandLine.options, host)
  program.emit()

  return Promise.all(
    Object.keys(createdFiles).map(async outputPath => {
      const code = createdFiles[outputPath]
      await fs.outputFile(outputPath, code)
    })
  )
}

const commaSeparatedList = value => value.split(',')

program
  .option('--ignore [glob]', 'List of patterns to ignore during the compilation', commaSeparatedList)
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

const {ignore: ignoreOpts = [], modern: isModern = false} = program.opts()
const ignore = [...ignoreOpts, '**/__tests__']

;(async () => {
  console.time('[sui-js-compiler]')

  const files = await fg('./src/**/*.{js,jsx,ts,tsx}', {ignore})
  const filesToCompile = Promise.all(
    files.map(async file => {
      const isTypeScript = Boolean(file.match(TS_EXTENSION_REGEX))

      await compileFile(file, {isModern, isTypeScript})
    })
  )
  const tsConfig = getTsConfig()
  // If TS config exists, set TypeScript as enabled.
  const isTypeScriptEnabled = Boolean(tsConfig)
  const typesToCompile = isTypeScriptEnabled
    ? await compileTypes(files, {
        ...DEFAULT_TS_CONFIG,
        ...(tsConfig?.compilerOptions ?? {})
      })
    : Promise.resolve()

  await Promise.all([filesToCompile, typesToCompile])

  console.timeEnd('[sui-js-compiler]')
})()
