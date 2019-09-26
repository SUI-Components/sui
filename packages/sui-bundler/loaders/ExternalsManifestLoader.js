const path = require('path')
const https = require('https')
let MANIFEST = false

const getRemoteManifest = url =>
  new Promise((resolve, reject) => {
    if (MANIFEST) {
      return resolve(MANIFEST)
    }

    https
      .get(url, resp => {
        let data = ''

        resp.on('data', chunk => {
          data += chunk
        })
        resp.on('end', () => {
          MANIFEST = JSON.parse(data)
          resolve(MANIFEST)
        })
      })
      .on('error', err => {
        reject(err)
      })
  })

async function externalsManifestLoader(source) {
  const cb = this.async()
  const {manifestURL} = this.query

  if (process.env.NODE_ENV === 'development') {
    return cb(null, source)
  }

  if (!manifestURL) {
    return cb(null, source)
  }

  try {
    const manifest = await getRemoteManifest(
      typeof manifestURL === 'string'
        ? manifestURL
        : manifestURL[process.env.NODE_ENV]
    )
    const entries = Object.entries(manifest)
    const nextSource = entries.reduce((acc, entry) => {
      const [dest, src] = entry
      const regex = new RegExp(dest, 'g')
      return acc.replace(regex, src)
    }, source)

    cb(null, nextSource)
  } catch (e) {
    this.emitError(e)
    cb(e)
  }
}

module.exports = externalsManifestLoader
