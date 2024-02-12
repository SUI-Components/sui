#!/usr/bin/env node
/* eslint-disable no-console */

'use strict'

import {readFile} from 'fs/promises'

import program from 'commander'
import fg from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'
import prettier from 'prettier'

import {transformFile} from '@swc/core'

import {getSWCConfig} from '@s-ui/compiler-config'

const SOURCE_DIR = './src'
const OUTPUT_DIR = './lib'
const FILE_EXTENSION_REGEX = /(\.(j|t)s)x?/
const TS_EXTENSION_REGEX = /(\.ts)x?/
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
const MODULE_TYPES_MAP = {commonjs: {extension: '.cjs', type: 'require'}, es6: {extension: '.js', type: 'import'}}
const INDEX_KEY = 'index'
const INDEX_EXPORT_KEY = '.'

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

/**
 * Compile files and returns the exports object for each file.
 */
const compileFile = async (file, options) => {
  const modulesTypesMap = options.isTypeScript
    ? {...MODULE_TYPES_MAP, typescript: {extension: '.d.ts', type: 'types'}}
    : MODULE_TYPES_MAP

  return Object.keys(modulesTypesMap).reduce(async (fileExports, moduleType) => {
    const {extension, type} = modulesTypesMap[moduleType]
    const outputPath = file.replace(SOURCE_DIR, OUTPUT_DIR).replace(FILE_EXTENSION_REGEX, extension)

    if (moduleType !== 'typescript') {
      const {code} = await transformFile(file, getSWCConfig({...options, type: moduleType}))

      await fs.outputFile(outputPath, code)
    }

    const fileParts = outputPath.match(new RegExp(`${OUTPUT_DIR}/(.*)${extension}`))

    let [, exportEntry] = fileParts

    if (exportEntry.includes(INDEX_KEY)) exportEntry = exportEntry.replace(INDEX_KEY, INDEX_EXPORT_KEY)
    if (exportEntry.endsWith?.('/.')) exportEntry = exportEntry.replace('/.', '')
    if (exportEntry !== '.') exportEntry = `${OUTPUT_DIR}/${exportEntry}`

    return {...(await fileExports), [exportEntry]: {...(await fileExports)[exportEntry], [type]: outputPath}}
  }, Promise.resolve({}))
}

/**
 * Compile types.
 */
const compileTypes = async (files, options) => {
  const {createCompilerHost, createProgram} = await import('typescript').then(module => module.default)
  const createdFiles = {}
  const host = createCompilerHost(options)

  host.writeFile = (fileName, contents) => (createdFiles[fileName] = contents)

  const program = createProgram(files, options, host)

  program.emit()

  return Promise.all(
    Object.keys(createdFiles).map(async outputPath => {
      const code = createdFiles[outputPath]

      await fs.outputFile(outputPath, code)
    })
  )
}

const packageJsonPath = path.join(process.cwd(), 'package.json')

const getConfig = async fileName => JSON.parse(await readFile(new URL(packageJsonPath, import.meta.url)))

const writeExports = async exports => {
  const packageConfig = await getConfig()
  const indexExport = exports[INDEX_EXPORT_KEY]
  if (indexExport) {
    packageConfig.main = indexExport.require
    packageConfig.module = indexExport.import
    packageConfig.types = indexExport.types
  }
  packageConfig.exports = exports
  const packageJson = await prettier.format(JSON.stringify(packageConfig), {parser: 'json'})

  fs.writeFileSync(packageJsonPath, packageJson)
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

  const files = await fg('./src/**/*.{js,jsx,ts,tsx,json}', {ignore})
  const filesToCompile = files
    // Skip DTS files.
    .filter(file => !file.endsWith('.d.ts'))
    .reduce(async (staticExports, file) => {
      const isTypeScript = Boolean(file.match(TS_EXTENSION_REGEX))
      const fileExports = await compileFile(file, {isModern, isTypeScript})

      return {...(await staticExports), ...fileExports}
    }, Promise.resolve({}))

  const tsConfig = getTsConfig()
  // If TS config exists, set TypeScript as enabled.
  const isTypeScriptEnabled = Boolean(tsConfig)
  const typesToCompile = isTypeScriptEnabled
    ? await compileTypes(files, {
        ...DEFAULT_TS_CONFIG,
        ...(tsConfig?.compilerOptions ?? {})
      })
    : Promise.resolve()

  const [staticExports] = await Promise.all([filesToCompile, typesToCompile])
  await writeExports(staticExports)

  console.timeEnd('[sui-js-compiler]')
})()
