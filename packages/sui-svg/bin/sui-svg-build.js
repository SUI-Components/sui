#!/usr/bin/env node

/* eslint no-console:0 */
import {optimize} from 'svgo'
import fg from 'fast-glob'
import {copy, outputFile, emptyDir, readFile} from 'fs-extra'
import {promisify} from 'util'
import {join} from 'path'
import toCamelCase from 'just-camel-case'
import {transformAsync} from '@babel/core'

import template from '../templates/icon-component.js'
const exec = promisify(require('child_process').exec)

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
  copy(
    require.resolve('../templates/icon-styles.scss'),
    `${LIB_FOLDER}/index.scss`
  )

const createIndexFile = () =>
  outputFile(
    `${LIB_FOLDER}/_demo.js`,
    `export const icons = import.meta.globEager('./**/*.js')`
  )

emptyDir(LIB_FOLDER)
  .then(installNeededDependencies)
  .then(getAllSrcSvgFiles)
  .then(entries =>
    Promise.all([
      entries.map(file => {
        readFile(file, 'utf8')
          .then(transformSvgToReactComponent)
          .then(transformCodeWithBabel)
          .then(result => outputFile(getLibFile(file), result.code))
          .catch(error => {
            console.error(error)
            process.exit(1)
          })
      })
    ])
  )
  .then(createIndexFile)
  .then(copyStylesFile)
