#!/usr/bin/env node
const copyfiles = require('./helpers/copy.js')

const [, , from, to] = process.argv

copyfiles([from, to], {up: 1})
  .then(() => {
    console.log('Files copied successfully')
  })
  .catch(err => {
    console.error(err)
  })
