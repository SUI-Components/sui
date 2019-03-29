#!/usr/bin/env node
/* eslint no-console:0 */
const fg = require('fast-glob')
const svgr = require('@svgr/core').default
const fs = require('fs-extra')
const program = require('commander')
const {join} = require('path')
const template = require('../templates/pure-component')
const toCamelCase = require('lodash.camelcase')
const babel = require('@babel/core')

const BASE_DIR = process.cwd()
const LIB_FOLDER = join(BASE_DIR, '.', 'lib')
const SVG_FOLDER = join(BASE_DIR, '.', 'src')

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Builds React lib based on svg files')
    console.log('')
    console.log('    Setup your repo with a svg folder')
    console.log('    Every svg file inside this folder will be converted into')
    console.log('    a React component')
    console.log('')
  })
  .parse(process.argv)

const camelCase = function(fileName) {
  const camelFile = toCamelCase(fileName)
  return `${camelFile[0].toUpperCase()}${camelFile.slice(1)}`
}

const getLibFile = function(file) {
  const [, rawPath, rawfileName] = file.match('^.*/src/(.+/)*(.*).svg$')
  const fileName = camelCase(rawfileName)
  const path = rawPath || ''
  return `${LIB_FOLDER}/${path}${fileName}.js`
}

function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory()
  } catch (error) {
    return false
  }
}

function ensureDirectoryExistence(dirname) {
  if (directoryExists(dirname)) {
    return true
  }
  fs.mkdirSync(dirname)
}

ensureDirectoryExistence(LIB_FOLDER)

fg([`${SVG_FOLDER}/**/*.svg`]).then(entries =>
  entries.forEach(file => {
    console.log(`Converting ${file}`)
    fs.readFile(file, (err, data) => {
      if (err) throw err
      svgr(
        data,
        {
          template,
          expandProps: false,
          removeTitle: true
        },
        {componentName: 'SVGComponent'}
      )
        .then(jsCode =>
          babel.transformAsync(jsCode, {
            presets: ['sui']
          })
        )
        .then(result => {
          fs.outputFile(getLibFile(file), result.code, function(error) {
            if (error) {
              throw error
            }
          })
        })
        .catch(error => {
          console.error(error)
        })
    })
  })
)
