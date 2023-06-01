// @ts-check

'use strict'

const path = require('path')
const fs = require('fs-extra')
const glob = require('fast-glob')

const debug = require('./debug.js')
const resolveFilePath = require('./resolveFilePath.js')

module.exports = async function removeFiles(args, config = {}) {
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
    debug('No files found.')
    return
  }

  debug(`Removing ${files.length} files from ${input} `)

  return Promise.all(
    files.map(file => {
      const outName = path.join(outDir, resolveFilePath(file, {flatten, up}))
      debug(`Removing ${outName}`)
      return fs.unlinkSync(outName)
    })
  )
}
