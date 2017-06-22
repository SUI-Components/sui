/* eslint no-console:0 */

const colors = require('colors')
const spawn = require('child_process').spawn
const program = require('commander')
const BASE_DIR = process.cwd()
const CODE_OK = 0
const cwds = require('./walker').componentsFullPath(BASE_DIR)

program
  .parse(process.argv)

const doTask = (cwd) => {
  const [component, category] = cwd.split('/').reverse()
  const [command, ...args] = program.args
  const prefix = `${category}/${component}`
  return new Promise((resolve, reject) => {
    const running = spawn(command, args, {cwd})
      .on('error', reject)
      .on('close', (code) => {
        if (code !== CODE_OK) { process.exit(code) }
        resolve({prefix, code})
      })
    running.stdout.on('data', data => console.log(colors.gray(`[${prefix}]: ${data.toString()}`)))
    running.stderr.on('data', data => console.log(colors.red(`[${prefix}]: ${data.toString()}`)))
  })
}

Promise.all(
  cwds.map(cwd => () => doTask(cwd))
      .reduce((m, p) => m.then(v => Promise.all([...v, p()])), Promise.resolve([]))
)
.then(task => console.log(task))
