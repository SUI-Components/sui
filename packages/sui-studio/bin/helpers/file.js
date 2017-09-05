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
  return fse.outputFile(path, content).then(() => {
    console.log(colors.gray(`Created ${path}`)) // eslint-disable-line no-console
  })
  .catch(err => {
    showError(`Fail creating ${path}`)
    throw new Error(err)
  })
}

module.exports = { writeFile }
