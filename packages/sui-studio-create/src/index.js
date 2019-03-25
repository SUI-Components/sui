#!/usr/bin/env node
/* eslint no-console:0 */

const colors = require('colors')
const program = require('commander')
const BASE_DIR = process.cwd()
const fse = require('fs-extra')
const {getSpawnPromise} = require('@s-ui/helpers/cli')

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

const showError = msg => {
  program.outputHelp(txt => colors.red(txt))
  console.error(colors.red(msg))
  process.exit(1)
}

const writeFile = (path, body) => {
  return new Promise((resolve, reject) => {
    fse.outputFile(path, body, err => {
      if (err) {
        showError(`Fail modifying ${path}`)
        reject(err)
      } else {
        console.log(colors.gray(`Modified ${path}`))
        resolve()
      }
    })
  })
}

const createDir = path => {
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

if (!PROJECT_NAME) {
  showError('the project name must be defined')
}

Promise.all([
  createDir(`${PROJECT_PATH}/components`),
  createDir(`${PROJECT_PATH}/demo`)
])
  .then(() =>
    writeFile(
      `${PROJECT_PATH}/components/README.md`,
      `# ${PROJECT_NAME} components
    <!-- Here put a description about your project -->`
    )
  )
  .then(() =>
    writeFile(
      `${PROJECT_PATH}/package.json`,
      `{
  "name": "${PROJECT_NAME}",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "build": "sui-studio build",
    "check:release": "sui-studio check-release",
    "co": "sui-studio commit",
    "commitmsg": "validate-commit-msg",
    "deploy": "sui-deploy ${PROJECT_NAME} --now",
    "dev": "sui-studio dev",
    "generate": "sui-studio generate --prefix sui --scope ${PROJECT_NAME}",
    "lint:js": "sui-lint js",
    "lint:sass": "sui-lint sass",
    "lint": "npm run lint:js && npm run lint:sass",
    "phoenix:ci": "npx @s-ui/mono phoenix --no-progress && (cd demo && npx @s-ui/mono phoenix --no-progress)",
    "phoenix": "npx @s-ui/mono phoenix && (cd demo && npx @s-ui/mono phoenix)",
    "precommit": "sui-precommit run",
    "release": "sui-studio release",
    "start": "sui-studio start"
  },
  "repository": {},
  "keywords": [],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@s-ui/deploy": "2",
    "@s-ui/precommit": "2",
    "@s-ui/studio": "6",
    "husky": "0.14.3",
    "validate-commit-msg": "2.14.0"
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
  },
  "eslintConfig": {
    "extends": ["./node_modules/@s-ui/lint/eslintrc.js"]
  },
  "sasslintConfig": "./node_modules/@s-ui/lint/sass-lint.yml"
}
`
    )
  )
  .then(() => getSpawnPromise('npm', ['i'], {cwd: PROJECT_PATH}))
  .then(process.exit)
  .catch(process.exit)
