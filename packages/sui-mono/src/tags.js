const {exec} = require('child_process')

function checkSUITag(tag, pkg) {
  if (pkg && !tag.startsWith(`${pkg}-`)) {
    return false
  }

  return /^.+-[0-9]+\.[0-9]+\.[0-9]+(-.+)?$/.test(tag)
}

function fetchTags(pkg, opts = {}) {
  return new Promise((resolve, reject) => {
    const regex = /tag:\s*(.+?)[,)]/gi
    const cmd = 'git log --decorate --no-color --date-order'

    const options = {
      maxBuffer: Infinity,
      cwd: process.cwd(),
      ...opts
    }

    exec(cmd, options, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const tags = []
      let match
      let tag

      data.split('\n').forEach(decorations => {
        while ((match = regex.exec(decorations))) {
          tag = match[1]

          if (checkSUITag(tag, pkg)) {
            tags.push(tag)
          }
        }
      })

      resolve(tags)
    })
  })
}

module.exports = {
  fetchTags
}
