/* eslint-disable no-console */
const {join} = require('path')
const {readdirSync, statSync, writeFile} = require('fs')

const BASE_DIR = process.cwd()
const JSON_FILE = join(BASE_DIR, '.', 'src/images.json')

function processImages({path, host}) {
  const IMAGES_FOLDER = join(BASE_DIR, '.', path)

  const allFiles = recursiveReaddirSync(IMAGES_FOLDER)
  const files = cleanDirectories(allFiles)
  const imageFileNames = getImageFileNames(files, IMAGES_FOLDER)

  const json = {
    host,
    images: imageFileNames
  }

  writeFile(JSON_FILE, JSON.stringify(json), err => {
    if (err) return console.log(err)
    console.log('All images parsed 😊')
  })
}

function recursiveReaddirSync(dir, allFiles = []) {
  const files = readdirSync(dir).map(f => join(dir, f))

  allFiles.push(...files)
  files.forEach(
    f => statSync(f).isDirectory() && recursiveReaddirSync(f, allFiles)
  )

  return allFiles
}

function cleanDirectories(files) {
  return files.filter(file => !statSync(file).isDirectory())
}

function getImageFileNames(files) {
  return files.map(file => file.replace(BASE_DIR, ''))
}

module.exports = {processImages}
