#!/usr/bin/env node

const {transformFile} = require('@swc/core')
const defaultConfig = require('./swc-config.js')
const fg = require('fast-glob')
const fs = require('fs-extra')

;(async () => {
  console.time('[sui-js-compiler]')

  const files = await fg('./src/**/*.{js,jsx}')

  await Promise.all(
    files.map(async file => {
      const output = await transformFile(file, defaultConfig)
      const {code} = output
      const outputPath = file.replace('./src', './lib')
      return fs.outputFile(outputPath, code)
    })
  )

  console.timeEnd('[sui-js-compiler]')
})()
