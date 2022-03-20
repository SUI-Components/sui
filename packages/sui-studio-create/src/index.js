#!/usr/bin/env node
/* eslint no-console:0 */

import fse from 'fs-extra'
import childProcess from 'child_process'

const {spawn} = childProcess

const BASE_DIR = process.cwd()
const [, , param] = process.argv
const HELP_PARAM = ['--help', '-h']

const createDir = path => fse.mkdirp(path)
const writeFile = (path, body) => fse.outputFile(path, body)

const showHelp = () => {
  console.log('  Examples:')
  console.log('')
  console.log('    $ sui-studio-create <project-name>')
  console.log('    $ sui-studio-create sui-studio')
  console.log('    $ sui-studio-create --help')
  console.log('    $ sui-studio-create -h')
  console.log('')
  process.exit(0)
}

if (HELP_PARAM.includes(param) || !param) {
  showHelp()
}

const PROJECT_NAME = param
const PROJECT_PATH = `${BASE_DIR}/${PROJECT_NAME}`

Promise.all([createDir(`${PROJECT_PATH}/components`)])
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
  "workspaces": [
    "components/**"
  ],
  "private": true,
  "scripts": {
    "build": "sui-studio build",
    "check:release": "sui-mono check-release",
    "co": "sui-mono commit",
    "commit-msg": "validate-commit-msg",
    "dev": "sui-studio dev",
    "generate": "sui-studio generate --prefix sui --scope ${PROJECT_NAME}",
    "lint:js": "sui-lint js",
    "lint:sass": "sui-lint sass",
    "lint": "npm run lint:js && npm run lint:sass",
    "phoenix": "npx @s-ui/mono@2 run 'rm -rf ./node_modules' && rm -rf ./node_modules && npm install --legacy-peer-deps",
    "phoenix:ci": "npm run phoenix -- --no-optional --no-fund --no-audit",
    "pre-commit": "npm run lint"
    "release": "sui-mono release",
    "start": "sui-studio start"
  },
  "repository": {},
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@s-ui/precommit": "3",
    "@s-ui/lint": "4",
    "@s-ui/studio": "11",
    "validate-commit-msg": "2.14.0"
  },
  "dependencies": {
    "@s-ui/component-dependencies": "1"
  },
  "config": {
    "validate-commit-msg": {
      "types": "@s-ui/mono/src/types"
    }
  },
  "eslintConfig": {
    "extends": ["./node_modules/@s-ui/lint/eslintrc.js"]
  },
  "stylelint": {
    "extends": "./node_modules/@s-ui/lint/stylelint.config.js"
  }
}
`
    )
  )
  .then(() => {
    console.log(
      '[sui-studio-create] Created folder structure. Installing dependencies...'
    )
    spawn('npm', ['install', '--no-fund', '--no-audit'], {
      cwd: PROJECT_PATH,
      stdio: 'inherit'
    })
  })
  .catch(err => {
    console.error('Error:')
    console.error(err)
    process.exit(1)
  })
