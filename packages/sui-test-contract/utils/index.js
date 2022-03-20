const childProcess = require('child_process')

const exec = command => childProcess.execSync(command).toString().trim()

module.exports = {exec}
