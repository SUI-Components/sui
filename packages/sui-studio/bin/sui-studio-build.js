#!/usr/bin/env node
/* eslint no-console:0 */

const colors = require('colors')
const {execFile} = require('child_process')
const {join} = require('path')

console.log('\n', process.env.NODE_ENV, '\n')
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const devServerExec = join(__dirname, '..', 'node_modules', '@schibstedspain', 'suistudio-webpack', 'bin', 'suistudio-webpack-build.js')
const child = execFile(
  devServerExec,
  ['-C'],
  {cwd: join(__dirname, '..')},
  (err, stdout, stderr) => {
    if (err) { console.log(colors.red(err)) }
    console.log(colors.gray('Tal vez quieres publicar tu carpeta public a surge.sh'))
  }
)
child.stdout.pipe(process.stdout)
