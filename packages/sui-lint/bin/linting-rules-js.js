#!/usr/bin/env node
const {execFile} = require('child_process')
const {resolve} = require('path')

const ESLINT_PATH = resolve(__dirname, '..', '..', '..', '.bin', 'eslint')
const CONFIG_PATH = resolve(__dirname, '..', 'eslintrc.js')

const [node, bin, ...args] = process.argv
if(args.find(arg => arg === '-c')) {
  console.log('[linting-rules-js] Dont use your own config file. Remove `-c` flag')
  process.exit(1)
}

const child = execFile(
  ESLINT_PATH,
  [
    '-c', CONFIG_PATH,
    '--ext', 'js',
    '--ext', 'jsx',
    '--ignore-pattern', 'lib',
    '--ignore-pattern', 'dist',
    '--ignore-pattern', 'node_modules',
    './'
  ].concat(args),
  err => err && err.code && process.exit(err.code)
)
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)
