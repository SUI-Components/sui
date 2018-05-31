const path = require('path')
const fs = require('fs')
const archiver = require('archiver')

module.exports = ({outputZipPath, pkg}) =>
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath)
    const archive = archiver('zip', {
      zlib: {level: 9}
    })

    output.on('close', resolve)
    archive.on('error', reject)
    archive.pipe(output)
    archive.append(
      fs
        .readFileSync(path.join(__dirname, 'pm2.tpl'), 'utf8')
        .replace('{{name}}', pkg.name),
      {name: 'pm2.json'}
    )
    archive.file(path.join(__dirname, 'Dockerfile'), {name: 'Dockerfile'})
    archive.directory(path.join(process.cwd(), 'public'), 'public')
    archive.directory(path.join(process.cwd(), 'statics'), 'statics')
    archive.directory(path.join(process.cwd(), 'server'), 'server')
    archive.finalize()
  })
