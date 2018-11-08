#!/usr/bin/env node
/* eslint no-console:0 */
const Walker = require('walker')
const svgr = require('@svgr/core').default
const fs = require('fs')
const program = require('commander')
const {join} = require('path')
const template = require('../templates/pure-component')
const toCamelCase = require('@s-ui/js/lib/string').toCamelCase

const BASE_DIR = process.cwd()
const COMPONENT_EXTENSION = 'js'
const ENCODING = 'utf-8'
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

const convertFileName = function(fileName) {
  const camelFile = toCamelCase(fileName)
  return `${camelFile[0].toUpperCase()}${camelFile.slice(1)}`
}

const getLibFile = function(file) {
  const fileName = file.match('^.*/(.*).svg$')[1]
  return `${LIB_FOLDER}/${convertFileName(fileName)}.${COMPONENT_EXTENSION}`
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
Walker(SVG_FOLDER).on('file', function(file) {
  console.log(`Converting ${file}`)
  fs.readFile(file, (err, data) => {
    if (err) throw err
    svgr(
      data,
      {
        template,
        expandProps: false
      },
      {componentName: 'SVGComponent'}
    ).then(jsCode => {
      fs.writeFile(getLibFile(file), jsCode, ENCODING, function(error) {
        if (error) {
          throw error
        }
      })
    })
  })
})
