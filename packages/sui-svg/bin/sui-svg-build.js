#!/usr/bin/env node

/* eslint no-console:0 */
import {exec as execWithCallback} from 'child_process'
import commander, {Option} from 'commander'
import {createRequire} from 'module'
import {join} from 'path'
import {promisify} from 'util'

import fg from 'fast-glob'
import fs from 'fs-extra'
import toCamelCase from 'just-camel-case'
import {optimize} from 'svgo'

import {transformAsync} from '@babel/core'

import template from '../templates/icon-component.js'

const require = createRequire(import.meta.url)
const exec = promisify(execWithCallback)
const {copy, outputFile, emptyDir, readFile} = fs

const ATOM_ICON_VERSION = 1
const ATOM_ICON_PACKAGE = '@s-ui/react-atom-icon'

const BASE_DIR = process.cwd()
const PACKAGE_JSON = require(join(BASE_DIR, 'package.json'))
const LIB_FOLDER = 'lib'
const SVG_FOLDER = 'src'

const getLibFolder = (path = LIB_FOLDER) => join(BASE_DIR, path)
const getSVGFolder = (path = SVG_FOLDER) => join(BASE_DIR, path)

commander
  .addOption(new Option('-o, --output <outputDirectory>', 'save result on specified directory').default(LIB_FOLDER))
  .addOption(new Option('--src <inputDirectory>', 'directory where the icons are placed').default(SVG_FOLDER))
  .addOption(new Option('--index <boolean>', 'do index file').default('true').argParser(value => value === 'true'))
  .addOption(new Option('--styles <boolean>', 'do styles file').default('true').argParser(value => value === 'true'))
  .addOption(
    new Option('-d, --design <designType>', 'define the icon type')
      .choices(['filled', 'outlined'])
      .default('filled', 'filled icons')
  )
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-svg build -d outlined')
    console.log('')
  })
  .parse(process.argv)

const {design, output, src: input, index, styles} = commander.opts()

const camelCase = fileName => {
  const camelFile = toCamelCase(fileName)
  return `${camelFile[0].toUpperCase()}${camelFile.slice(1)}`
}

const getLibFile = (file, input, output) => {
  const [, rawPath, rawfileName] = file.match(`^.*/${input}/(.+/)*(.*).svg$`)
  const fileName = camelCase(rawfileName)
  const path = rawPath || ''
  return `${getLibFolder(output)}/${path}${fileName}.js`
}

const getAllSrcSvgFiles = input => fg([`${getSVGFolder(input)}/**/*.svg`])

const transformSvgToReactComponent = (svg, design, file) => {
  const {data} = optimize(svg)
  return template(data, design, file)
}

const transformCodeWithBabel = jsCode => {
  return transformAsync(jsCode, {
    presets: [require.resolve('babel-preset-sui')]
  })
}

const installNeededDependencies = () => {
  const {dependencies = {}} = PACKAGE_JSON
  const isInstalled = Boolean(dependencies[ATOM_ICON_PACKAGE])

  return isInstalled
    ? Promise.resolve(true)
    : exec(`npm install ${ATOM_ICON_PACKAGE}@${ATOM_ICON_VERSION} --save-exact`)
}

const copyStylesFile = output =>
  copy(require.resolve('../templates/icon-styles.scss'), `${getLibFolder(output)}/index.scss`)

const createIndexFile = output =>
  outputFile(`${getLibFolder(output)}/_demo.js`, `export const icons = import.meta.globEager('./**/*.js')`)

emptyDir(getLibFolder(output))
  .then(installNeededDependencies)
  .then(() => getAllSrcSvgFiles(input))
  .then(entries =>
    Promise.all([
      entries.map(file =>
        new Promise((resolve, reject) => {
          readFile(file, 'utf8', (err, data) => {
            if (err) {
              reject(err)
            }
            const [, , rawfileName] = file.match(`^.*/${input}/(.+/)*(.*).svg$`)
            return resolve([data, rawfileName])
          })
        })
          .then(([fileContent, file]) => transformSvgToReactComponent(fileContent, design, file))
          .then(code => {
            const response = code.replace(
              'import React from "react";',
              `import React from "react";\nimport {${camelCase(file)}} from "${ATOM_ICON_PACKAGE}";`
            )
            return response
          })
          .then(v => {
            return transformCodeWithBabel(v)
          })
          .then(result => {
            return outputFile(getLibFile(file, input, output), result.code)
          })
          .catch(error => {
            console.error(error)
            process.exit(1)
          })
      )
    ])
  )
  .then(() => index && createIndexFile(output))
  .then(() => styles && copyStylesFile(output))
