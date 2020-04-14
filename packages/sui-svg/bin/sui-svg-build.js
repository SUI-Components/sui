#!/usr/bin/env node
/* eslint no-console:0 */
const fg = require('fast-glob')
const svgr = require('@svgr/core').default
const fs = require('fs-extra')
const program = require('commander')
const {join} = require('path')
const toCamelCase = require('just-camel-case')
const babel = require('@babel/core')
const {getSpawnPromise} = require('@s-ui/helpers/cli')

const template = require('../templates/icon-component')

const ATOM_ICON_VERSION = 1
const ATOM_ICON_PACKAGE = '@s-ui/react-atom-icon'

const BASE_DIR = process.cwd()
const LIB_FOLDER = join(BASE_DIR, '.', 'lib')
const PACKAGE_JSON = require(join(BASE_DIR, '.', 'package.json'))
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

const transformSvgToReactComponent = svg =>
  svgr(svg, {
    template,
    expandProps: false,
    removeTitle: true
  })

const transformCodeWithBabel = jsCode =>
  babel.transformAsync(jsCode, {
    presets: [require.resolve('babel-preset-sui')]
  })

const installNeededDependencies = () => {
  const {dependencies = {}} = PACKAGE_JSON
  const isInstalled = Boolean(dependencies[ATOM_ICON_PACKAGE])

  return isInstalled
    ? Promise.resolve(true)
    : getSpawnPromise('npm', [
        'install',
        `${ATOM_ICON_PACKAGE}@${ATOM_ICON_VERSION}`,
        '--save-exact'
      ])
}

const copyStylesFile = () => {
  fs.copy(
    require.resolve('../templates/icon-styles.scss'),
    `${LIB_FOLDER}/index.scss`
  )
}

fs.emptyDir(LIB_FOLDER)
  .then(installNeededDependencies)
  .then(getAllSrcSvgFiles)
  .then(entries =>
    entries.forEach(file => {
      fs.readFile(file, 'utf8')
        .then(transformSvgToReactComponent)
        .then(transformCodeWithBabel)
        .then(result => fs.outputFile(getLibFile(file), result.code))
        .catch(error => {
          console.error(error)
          process.exit(1)
        })
    })
  )
  .then(copyStylesFile)
