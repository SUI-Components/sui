#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander')
const glob = require('fast-glob')
const fs = require('fs-extra')

program.on('--help', () => {
  console.log('Migrate to new test folder structure')
  console.log('  Examples:')
  console.log('')
  console.log('    $ sui-studio test-migrate')
  console.log('')
})

const files = glob.sync(['test/*/*/index.js'])

files.forEach(file => {
  const [category, component] = file
    .replace('/index.js', '')
    .replace('test/', '')
    .split('/')

  const newFilePath = `./components/${category}/${component}/test`

  fs.ensureDirSync(newFilePath)
  console.log('Created or already exist dest folder')

  const newFile = `${newFilePath}/index.js`

  fs.copyFileSync(file, newFile)
  console.log(`Created file: ${newFile}`)

  fs.removeSync(`./test/${category}/${component}`)
  console.log(`Removed file: ${file}`)
})

fs.removeSync('./test')
console.log('Removed test folder not needed anymore')
