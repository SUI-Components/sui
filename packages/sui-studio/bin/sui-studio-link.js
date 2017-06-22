/* eslint no-console:0 */

const colors = require('colors')
const spawn = require('child_process').spawn
const fs = require('fs-extra')
const program = require('commander')
const BASE_DIR = process.cwd()

program
  .parse(process.argv)

const [origin, destination] = Array.prototype.map.call(program.args, url => `${BASE_DIR}/components/${url}`)

const originPackageName = require(`${origin}/package.json`).name

const build = () => {
  return new Promise((resolve, reject) => {
    fs.removeSync(`${destination}/node_modules/${originPackageName}`)
    const build = spawn('npm', ['run', 'build'], {cwd: origin})
                    .on('error', reject)
                    .on('close', resolve)
    build.stdout.on('data', data => console.log(colors.gray(`[${originPackageName}]: ${data.toString()}`)))
    build.stderr.on('data', data => console.log(colors.red(`[${originPackageName}]: ${data.toString()}`)))
  })
}

const createLink = () => {
  return new Promise((resolve, reject) => {
    const link = spawn('ln', ['-s', `${origin}`, `${destination}/node_modules/${originPackageName}`])
                  .on('error', reject)
                  .on('close', resolve)
    link.stdout.on('data', data => console.log(colors.gray(`[${originPackageName}]: ${data.toString()}`)))
    link.stderr.on('data', data => console.log(colors.red(`[${originPackageName}]: ${data.toString()}`)))
  })
}

const watch = () => {
  return new Promise((resolve, reject) => {
    const babel = spawn('npm', ['run', 'babel', '--', '--watch'], {cwd: origin})
    babel.stdout.on('data', data => console.log(colors.gray(`[${originPackageName}]: ${data.toString()}`)))
    babel.stderr.on('data', data => console.log(colors.red(`[${originPackageName}]: ${data.toString()}`)))

    fs.watch(origin, {recursive: true}, (event, filename) => {
      if (event === 'change' && filename.indexOf('.scss') !== -1) {
        console.log(colors.gray(`[${originPackageName}]: ${filename} -> lib/${filename}`))
        fs.copySync(`${origin}/${filename}`, `${origin}/${filename.replace('src', 'lib')}`)
      }
    })
  })
}

build()
  .then(createLink)
  .then(watch)
  .then(console.log.bind(console))
