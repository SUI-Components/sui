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

  if (!manifestURL) {
    return cb(null, source)
  }

  try {
    const dirname = path.dirname(manifestURL)
    const manifest = await getRemoteManifest(manifestURL)
    const entries = Object.entries(manifest)
    const nextSource = entries.reduce((acc, entry) => {
      const [dest, src] = entry
      const regex = new RegExp(`${dirname}${dest}`, 'g')
      return acc.replace(regex, `${dirname}${src}`)
    }, source)

    cb(null, nextSource)
  } catch (e) {
    this.emitError(e)
    cb(e)
  }
}

module.exports = externalsManifestLoader
