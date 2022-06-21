import childProcess from 'node:child_process'

export const exec = command => childProcess.execSync(command).toString().trim()
