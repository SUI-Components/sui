/* eslint no-console:0 */

const colors = require('colors')
const path = require('path')
const {remove} = require('fs-extra')
const BASE_DIR = process.cwd()
const cwds = require('./walker').componentsFullPath(BASE_DIR)

const removeNodeModulesFolder = cwd => {
  const [component, category] = cwd.split(path.sep).reverse()
  const prefix = `${category}/${component}`
  return new Promise((resolve, reject) => {
    console.log(colors.gray(`[${prefix}]: Removing node_modules`))
    remove(`${cwd}/node_modules`, err => {
      if (err) {
        return reject(err)
      }
      console.log(colors.gray(`[${prefix}]: Removed`))
      resolve()
    })
  })
}

Promise.all(cwds.map(removeNodeModulesFolder))
