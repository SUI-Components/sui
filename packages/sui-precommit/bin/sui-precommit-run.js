#!/usr/bin/env node

const {spawn} = require('child_process')
const BIN_PATH = require.resolve('@schibstedspain/sui-lint/bin/sui-lint')

spawn(BIN_PATH, ['js'], { shell: true, stdio: 'inherit' })
  .on('exit', code => { code && process.exit(code) })

spawn(BIN_PATH, ['sass'], { shell: true, stdio: 'inherit' })
  .on('exit', code => { code && process.exit(code) })

spawn('npm', ['run', 'test'], { shell: true, stdio: 'inherit' })
  .on('exit', code => { code && process.exit(code) })
