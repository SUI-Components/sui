const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const program = require('commander')
const authDefinitionBuilder = require('./authDefinitionBuilder')

module.exports = ({outputZipPath, pkg, entryPoint, dockerRegistry}) =>
  new Promise((resolve, reject) => {
    const authVariableDefinition = program.auth
      ? authDefinitionBuilder(program.auth.split(':'))
      : ''
    const entryPointPreWork = !entryPoint
      ? ''
      : 'COPY ./entry-point ./entry-point\nRUN chmod +x ./entry-point'

    const entryPointLine = !entryPoint ? '' : 'ENTRYPOINT ["./entry-point"]'
    const output = program.outputFileName
      ? fs.createWriteStream(outputZipPath)
      : process.stdout
    const archive = archiver('zip', {
      zlib: {level: 9}
    })

    output.on('close', () => {
      // eslint-disable-next-line no-console
      console.log(
        '-> File',
        program.outputFileName.magenta.bold + '.zip'.magenta.bold,
        ' was created - size ',
        Math.round(archive.pointer() / 1024).toString().blue.bold +
          ' kb'.blue.bold
      )
      // eslint-disable-next-line no-console
      console.log(' -> Success ✅'.green)

      resolve()
    })
    archive.on('error', reject)
    archive.pipe(output)
    archive.append(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'),
      {
        name: 'package.json'
      }
    )

    entryPoint &&
      archive.append(fs.readFileSync(entryPoint, 'utf8'), {
        name: 'entry-point'
      })

    archive.append(
      fs
        .readFileSync(path.join(__dirname, 'pm2.tpl'), 'utf8')
        .replace('{{name}}', pkg.name),
      {name: 'pm2.json'}
    )

    archive.append(
      fs
        .readFileSync(path.join(__dirname, 'Dockerfile.tpl'), 'utf8')
        .replace('{{DOCKER_REGISTRY}}', dockerRegistry)
        .replace('{{AUTH_VARIABLES}}', authVariableDefinition)
        .replace('{{ENTRYPOINT_PREWORK}}', entryPointPreWork)
        .replace('{{ENTRYPOINT}}', entryPointLine),
      {name: 'Dockerfile'}
    )
    archive.directory(path.join(process.cwd(), 'public'), 'public')
    archive.directory(path.join(process.cwd(), 'statics'), 'statics')
    archive.directory(path.join(process.cwd(), 'server'), 'server')
    archive.finalize()
  })
