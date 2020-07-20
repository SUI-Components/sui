const https = require('https')
const http = require('http')
let MANIFEST = false

/**
 * Return a Manifest object from the origen defined
 * @param {string} url - Url to request the manifest
 * @return {Promise<Object>} this should be the manifest
 * */
const getRemoteManifest = url => {
  const client = url.indexOf('https') > -1 ? https : http
  return new Promise((resolve, reject) => {
    if (MANIFEST) {
      return resolve(MANIFEST)
    }

    client
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
}

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
