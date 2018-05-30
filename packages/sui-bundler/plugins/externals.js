const path = require('path')
const fs = require('fs')
const md5File = require('md5-file')

const HASH_LENGTH = 8
const envVars = str => str.replace(/\$(\w+)/g, (str, p1, p2) => process.env[p1])

const safeAddToHeadAndBody = htmlPluginData => url => {
  const script = `<script src="${url}"></script>`
  const link = `<link rel="preload" href="${url}" as="script">` // TODO: always is a script ?! I dont think so
  htmlPluginData.html = htmlPluginData.html
    .replace('<head>', `<head>\n${link}\n`)
    .replace('</body>', `${script}\n</body>`)
}

const generateHashFromFile = uri =>
  new Promise((resolve, reject) => {
    md5File(
      path.resolve(process.cwd(), uri),
      (err, hash) =>
        hash !== undefined ? resolve(hash.slice(0, HASH_LENGTH)) : reject(err)
    )
  })

const copy = (uris, outputPath) => (hash, index) => {
  const from = path.resolve(process.cwd(), uris[index])
  const to = path.resolve(
    process.cwd(),
    `${outputPath}/${path.basename(uris[index])}`.replace(
      /\.(js|css|json)/,
      match => `.${hash}${match}`
    )
  )
  fs.createReadStream(from).pipe(fs.createWriteStream(to))
}

class Externals {
  constructor(options) {
    this.options = Object.assign({}, {files: {}}, options)
  }
  apply(compiler) {
    const {files} = this.options
    const uris = (Object.values(files) || []).map(envVars) // TODO: Remove this when merge with the version 3
    const hashsPromises = Promise.all(uris.map(generateHashFromFile))
    const {publicPath, path: outputPath} = compiler.options.output

    compiler.plugin('compilation', compilation => {
      compilation.plugin(
        'html-webpack-plugin-before-html-processing',
        (htmlPluginData, cb) => {
          const safeAddToHeadAndBodyAtHtmlPlugin = safeAddToHeadAndBody(
            htmlPluginData
          )
          hashsPromises.then(hashs => {
            hashs.forEach((hash, index) =>
              safeAddToHeadAndBodyAtHtmlPlugin(
                `${publicPath}${path.basename(uris[index])}`.replace(
                  /\.(js|css|json)/,
                  match => `.${hash}${match}`
                )
              )
            )
            cb(null, htmlPluginData)
          })
        }
      )
    })

    compiler.plugin('after-emit', (_, cb) =>
      hashsPromises
        .then(hashs => hashs.forEach(copy(uris, outputPath)))
        .then(cb)
    )
  }
}

module.exports = Externals
