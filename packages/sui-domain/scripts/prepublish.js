const path = require('path')
const fs = require('fs-extra')
const CWD = process.cwd()

fs.copy(path.join(CWD, 'lib'), CWD)
  .then(() => console.log('Copied files successfully!'))
  .catch(err => console.error(err))
