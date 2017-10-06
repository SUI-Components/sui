#!/usr/bin/env node
/* eslint no-console:0 */

const colors = require('colors')
const program = require('commander')
const BASE_DIR = process.cwd()
const fse = require('fs-extra')
const { getSpawnPromise } = require('@s-ui/helpers/cli')

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
const PROJECT_PATH = `${BASE_DIR}/${PROJECT_NAME}`

const showError = (msg) => {
  program.outputHelp(txt => colors.red(txt))
  console.error(colors.red(msg))
  process.exit(1)
}

const writeFile = (path, body) => {
  return new Promise((resolve, reject) => {
    fse.outputFile(
      path,
      body,
      err => {
        if (err) {
          showError(`Fail modifying ${path}`)
          reject(err)
        } else {
          console.log(colors.gray(`Modified ${path}`))
          resolve()
        }
      }
    )
  })
}

const createDir = (path) => {
  return new Promise((resolve, reject) => {
    fse.mkdirp(path, err => {
      if (err) {
        showError(`Fail creating ${path}`)
        reject(err)
      } else {
        console.log(colors.gray(`Created ${path}`))
        resolve()
      }
    })
  })
}

if (!PROJECT_NAME) { showError('the project name must be defined') }

Promise.all([
  createDir(`${PROJECT_PATH}/components`),
  createDir(`${PROJECT_PATH}/demo`)
])
  .then(() => writeFile(
    `${PROJECT_PATH}/components/README.md`,
    `# ${PROJECT_NAME} components
    <!-- Here put a description about your project -->`
  ))
  .then(() => writeFile(
    `${PROJECT_PATH}/package.json`,
    `{
  "name": "${PROJECT_NAME}",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "phoenix": "rm -Rf node_modules && npm i && sui-studio clean-modules && sui-studio run-all npm i",
    "deploy": "sui-deploy ${PROJECT_NAME} --now",
    "co": "sui-studio commit",
    "lint:js": "sui-lint js",
    "lint:sass": "sui-lint sass",
    "lint": "npm run lint:js && npm run lint:sass",
    "commitmsg": "validate-commit-msg",
    "precommit": "sui-precommit run",
    "generate": "sui-studio generate -P re -S schibstedspain"
  },
  "repository": {},
  "keywords": [],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@s-ui/deploy": "1",
    "@s-ui/precommit": "2",
    "@s-ui/studio": "4",
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
      "types": "@s-ui/mono/src/types"
    }
  }
}
`))
  .then(() => getSpawnPromise('npm', ['i'], {cwd: PROJECT_PATH}))
  .then(process.exit)
  .catch(process.exit)
