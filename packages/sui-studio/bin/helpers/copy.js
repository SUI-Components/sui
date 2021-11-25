// @ts-check

'use strict'

const path = require('path')
const fs = require('fs-extra')
const glob = require('fast-glob')

const {DEBUG} = process.env

/**
 * Show logging information if debug mode is enabled
 * @param {...any} args - arguments to log
 * @returns {void}
 */
const debug = (...args) => (DEBUG ? console.log('[copyfiles] ', ...args) : null)

/**
 * Check depth
 * @param {string} filePath - path of the file
 * @param {number} up - number of directories to go up
 * @returns
 */
const checkDepth = (filePath, up) => {
  // components/atom/button
  const depth = path.normalize(filePath).split(path.sep).length - 1
  return depth > up
}

/**
 * Resolve file path
 * @param {string} filePath - path of the file
 * @param {object} config - configuration object
 * @param {object} config.flatten - flatten the path
 * @param {number} config.up - number of directories to go up
 * @returns {string}
 */
const resolveFilePath = (filePath, {flatten, up}) => {
  if (flatten === true) return path.basename(filePath)
  if (up === 0) return filePath

  if (!checkDepth(filePath, up)) {
    throw new Error(
      "The number of folders you're trying to go up are not correct. Check the path or the up config"
    )
  }

  return path.join(
    ...path
      .normalize(filePath)
      .split(path.sep)
      .slice(up)
  )
}

module.exports = async function copyFiles(args, config) {
  const input = args.slice()
  const outDir = input.pop()
  const globOpts = {}

  const {flatten = false, up = 0} = config

  if (config.exclude) globOpts.ignore = config.exclude
  if (config.all) globOpts.dot = true
  if (config.follow) globOpts.followSymbolicLinks = true

  debug(`Config for glob: `, globOpts)

  const files = await glob(input, globOpts)

  debug(`Copying ${files.length} files from ${input} to ${outDir}`)

  return Promise.all(
    files.map(file => {
      const outName = path.join(outDir, resolveFilePath(file, {flatten, up}))
      debug(`Copying ${file} to ${outName}`)
      return fs.copy(file, outName)
    })
  )
}
