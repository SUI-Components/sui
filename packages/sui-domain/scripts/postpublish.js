const path = require('path')
const fs = require('fs')
const CWD = process.cwd()

const EXTENSIONS_TO_REMOVE = ['.js']

const handleError = err => { if (err) throw err }

fs.readdir(CWD, (err, files) => {
  handleError(err)

  files.forEach(file => {
    const ext = path.extname(file)
    EXTENSIONS_TO_REMOVE.includes(ext) &&
      fs.unlink(path.join(CWD, file), handleError)
  })
})
