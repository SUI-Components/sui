#!/usr/bin/env node
const copyfiles = require('./helpers/copy.js')

const [, , from, to] = process.argv

console.time('[copyfiles] :')

copyfiles([from, to], {up: 1})
  .then(() => {
    console.time('[copyfiles] :')
  })
  .catch(err => {
    console.error(err)
  })
