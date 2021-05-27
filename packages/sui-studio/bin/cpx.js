#!/usr/bin/env node
const copyfiles = require('copyfiles')

const [, , from, to] = process.argv

copyfiles([from, to], {up: 1}, err =>
  err ? console.error(err) : console.log('Files copied successfully')
)
