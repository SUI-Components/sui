// @ts-check

'use strict'

const path = require('path')
const fs = require('fs-extra')
const glob = require('fast-glob')

const debug = require('./debug.js')
const resolveFilePath = require('./resolveFilePath.js')

module.exports = async function copyFiles(args, config = {}) {
  const input = args.slice()
  const outDir = input.pop()
  const globOpts = {}

  const {flatten = false, up = 0} = config

  if (config.exclude) globOpts.ignore = config.exclude
  if (config.all) globOpts.dot = true
  if (config.follow) globOpts.followSymbolicLinks = true

  debug(`Config for glob: `, globOpts)

  const files = await glob(input, globOpts)

  if (files.length === 0) {
    console.log('No files found.')
    return
  }

  debug(`Copying ${files.length} files from ${input} to ${outDir}`)

  return Promise.all(
    files.map(file => {
      const outName = path.join(outDir, resolveFilePath(file, {flatten, up}))
      debug(`Copying ${file} to ${outName}`)
      return fs.copy(file, outName)
    })
  )
}
