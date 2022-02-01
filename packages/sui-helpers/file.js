const fse = require('fs-extra')
const colors = require('./colors.js')
const {showError} = require('./cli.js')

const log = msg => console.log(colors.gray(msg)) // eslint-disable-line no-console

/**
 * Write a file with given content
 * @param  {String} path Path of file to write
 * @param  {String} content Content to write
 * @return {Promise}
 */
const writeFile = (path, content) =>
  fse
    .outputFile(path, content)
    .then(() => log(`Created ${path}`))
    .catch(() => showError(`Failed creating ${path}`))

/**
 * Remove a file
 * @param  {String} path Path of file to remove
 * @return {Promise}
 */
const removeFile = path =>
  fse
    .remove(path)
    .then(() => log(`Removed ${path}`))
    .catch(() => showError(`Failed removing ${path}`))

module.exports = {writeFile, removeFile}
