#!/usr/bin/env node
/* eslint no-console:0 */

const BASE_DIR = process.cwd()
const fse = require('fs-extra')
const {spawn} = require('child_process')

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

Promise.all([
  createDir(`${PROJECT_PATH}/components`),
  createDir(`${PROJECT_PATH}/demo`),
  createDir(`${PROJECT_PATH}/test`)
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
    "dev": "sui-studio dev",
    "generate": "sui-studio generate --prefix sui --scope ${PROJECT_NAME}",
    "lint:js": "sui-lint js",
    "lint:sass": "sui-lint sass",
    "lint": "npm run lint:js && npm run lint:sass",
    "phoenix:ci": "npx @s-ui/mono phoenix --ci && (cd demo && npx @s-ui/mono phoenix --ci)",
    "phoenix": "npx @s-ui/mono phoenix && (cd demo && npx @s-ui/mono phoenix)",
    "release": "sui-studio release",
    "start": "sui-studio start"
  },
  "repository": {},
  "keywords": [],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@s-ui/precommit": "2",
    "@s-ui/studio": "9",
    "husky": "4.3.0",
    "validate-commit-msg": "2.14.0"
  },
  "dependencies": {
    "@s-ui/component-dependencies": "1"
  },
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
  "stylelint": {
    "extends": "./node_modules/@s-ui/lint/stylelint.config.js"
  },
  "husky": {
    "hooks": {
      "commit-msg": "validate-commit-msg",
      "pre-commit": "sui-precommit run"
    }
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
