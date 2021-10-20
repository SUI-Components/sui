#!/usr/bin/env node

const {transformFile} = require('@swc/core')
const fg = require('fast-glob')
const fs = require('fs-extra')
const defaultConfig = require('./swc-config.js')

;(async () => {
  console.time('[sui-js-compiler]')

  const files = await fg('./src/**/*.{js,jsx}')

  files.forEach(async file => {
    const {code} = await transformFile(file, defaultConfig)
    const outputPath = file.replace('./src', './lib')
    fs.outputFile(outputPath, code)
  })

  console.timeEnd('[sui-js-compiler]')
})()
