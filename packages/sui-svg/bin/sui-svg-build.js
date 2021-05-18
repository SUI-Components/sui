#!/usr/bin/env node

/* eslint no-console:0 */
const {optimize} = require('svgo')
const fg = require('fast-glob')
const fs = require('fs-extra')
const util = require('util')
const {join} = require('path')
const toCamelCase = require('just-camel-case')
const {transformAsync} = require('@babel/core')
const exec = util.promisify(require('child_process').exec)

const template = require('../templates/icon-component')

const ATOM_ICON_VERSION = 1
const ATOM_ICON_PACKAGE = '@s-ui/react-atom-icon'

const BASE_DIR = process.cwd()
const LIB_FOLDER = join(BASE_DIR, 'lib')
const PACKAGE_JSON = require(join(BASE_DIR, 'package.json'))
const SVG_FOLDER = join(BASE_DIR, 'src')

const camelCase = fileName => {
  const camelFile = toCamelCase(fileName)
  return `${camelFile[0].toUpperCase()}${camelFile.slice(1)}`
}

const getLibFile = file => {
  const [, rawPath, rawfileName] = file.match('^.*/src/(.+/)*(.*).svg$')
  const fileName = camelCase(rawfileName)
  const path = rawPath || ''
  return `${LIB_FOLDER}/${path}${fileName}.js`
}

const getAllSrcSvgFiles = () => fg([`${SVG_FOLDER}/**/*.svg`])

const transformSvgToReactComponent = svg => {
  const {data} = optimize(svg)
  return template(data)
}

const transformCodeWithBabel = jsCode =>
  transformAsync(jsCode, {
    presets: [require.resolve('babel-preset-sui')]
  })

const installNeededDependencies = () => {
  const {dependencies = {}} = PACKAGE_JSON
  const isInstalled = Boolean(dependencies[ATOM_ICON_PACKAGE])

  return isInstalled
    ? Promise.resolve(true)
    : exec(`npm install ${ATOM_ICON_PACKAGE}@${ATOM_ICON_VERSION} --save-exact`)
}

const copyStylesFile = () =>
  fs.copy(
    require.resolve('../templates/icon-styles.scss'),
    `${LIB_FOLDER}/index.scss`
  )

const createIndexFile = () =>
  fs.outputFile(
    `${LIB_FOLDER}/_demo.js`,
    `export const icons = import.meta.globEager('./**/*.js')`
  )

fs.emptyDir(LIB_FOLDER)
  .then(installNeededDependencies)
  .then(getAllSrcSvgFiles)
  .then(entries =>
    Promise.all([
      entries.map(file => {
        fs.readFile(file, 'utf8')
          .then(transformSvgToReactComponent)
          .then(transformCodeWithBabel)
          .then(result => fs.outputFile(getLibFile(file), result.code))
          .catch(error => {
            console.error(error)
            process.exit(1)
          })
      })
    ])
  )
  .then(createIndexFile)
  .then(copyStylesFile)
