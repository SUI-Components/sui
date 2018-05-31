const fse = require('fs-extra')
const colors = require('colors')
const {showError} = require('./cli')

/**
 * Write a file with given content
 * @param  {String} path Path of file to write
 * @param  {String} content Content to write
 * @return {Promise}
 */
const writeFile = (path, content) => {
  return fse
    .outputFile(path, content)
    .then(() => {
      console.log(colors.gray(`Created ${path}`)) // eslint-disable-line no-console
    })
    .catch(err => {
      showError(`Failed creating ${path}`)
      throw new Error(err)
    })
}

/**
 * Remove a file
 * @param  {String} path Path of file to remove
 * @return {Promise}
 */
const removeFile = path => {
  return fse
    .remove(path)
    .then(() => {
      console.log(colors.gray(`Removed ${path}`)) // eslint-disable-line no-console
    })
    .catch(err => {
      showError(`Failed removing ${path}`)
      throw new Error(err)
    })
}

module.exports = {writeFile, removeFile}
