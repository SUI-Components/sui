#!/usr/bin/env node
/* eslint no-console:0 */

const colors = require('colors')
const program = require('commander')
const BASE_DIR = process.cwd()
const fse = require('fs-extra')

program
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio-create <project-name>')
    console.log('    $ sui-studio-create sui-studio')
    console.log('    $ sui-studio-create --help')
    console.log('    $ sui-studio-create -h')
    console.log('')
  })
  .parse(process.argv)

const [PROJECT_NAME] = program.args

const showError = (msg) => {
  program.outputHelp(txt => colors.red(txt))
  console.error(colors.red(msg))
  process.exit(1)
}

const writeFile = (path, body) => {
  fse.outputFile(
    path,
    body,
    err => {
      if (err) { showError(`Fail creating ${path}`) }
      console.log(colors.gray(`Created ${path}`))
    }
  )
}

const createDir = (path) => {
  fse.mkdirp(path, err => {
    if (err) { showError(`Fail creating ${path}`) }
    console.log(colors.gray(`Created ${path}`))
  })
}

if (!PROJECT_NAME) { showError('the project name must be defined') }

createDir(`${BASE_DIR}/${PROJECT_NAME}/components`)
createDir(`${BASE_DIR}/${PROJECT_NAME}/demo`)

writeFile(
`${BASE_DIR}/${PROJECT_NAME}/components/README.md`,
`# ${PROJECT_NAME} components
<!-- Here put a description about your project -->`
)

writeFile(
`${BASE_DIR}/${PROJECT_NAME}/package.json`,
`{
  "name": "${PROJECT_NAME}",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "phoenix": "rm -Rf node_modules && npm i && sui-studio clean-modules && sui-studio run-all npm i",
    "deploy": "sui-studio build && surge public/ -d ${PROJECT_NAME}.surge.sh",
    "co": "sui-studio commit",
    "lint:js": "sui-lint js",
    "lint:sass": "sui-lint sass",
    "lint": "npm run lint:js && npm run lint:sass",
    "commitmsg": "validate-commit-msg",
    "precommit": "sui-precommit run"
  },
  "repository": {},
  "keywords": [],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@schibstedspain/sui-component-peer-dependencies": "1",
    "@schibstedspain/sui-precommit": "2",
    "@schibstedspain/sui-studio": "4",
    "@schibstedspain/suistudio-fatigue-dev": "github:SUI-Components/suistudio-fatigue-dev",
    "husky": "0.13.4",
    "validate-commit-msg": "2.12.2"
  },
  "dependencies": {},
  "config": {
    "sui-mono": {
      "packagesFolder": "./components",
      "deepLevel": 2
    },
    "validate-commit-msg": {
      "types": "@schibstedspain/sui-mono/src/types"
    }
  },
}
`
)
