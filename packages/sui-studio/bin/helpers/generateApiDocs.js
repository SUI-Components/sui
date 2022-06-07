const path = require('node:path')
const {promisify} = require('node:util')

const fg = require('fast-glob')
const exec = promisify(require('child_process').exec)

const cwd = process.env.INIT_CWD ?? process.cwd()

module.exports = async function generateApiDocs() {
  console.log('[sui-studio] Generating API documentation for components...')
  console.time('[sui-studio] API generation took')

  const components = fg.sync('components/*/*/src/index.js', {cwd, deep: 4})

  await exec(`npm install -g react-docgen@5`)

  const promises = components.map(file => {
    const outputFile = file.replace('index.js', 'definitions.json')
    const fullOutputFile = path.resolve(cwd, `public/${outputFile}`)

    return exec(
      `npx --yes react-docgen@5 ${file} --resolver findAllComponentDefinitions -o ${fullOutputFile}`,
      {
        cwd
      }
    ).catch(e => {
      console.error(e)
      console.warn(
        `[sui-studio] Error generating API documentation for ${file}`
      )
    })
  })

  console.log(
    `[sui-studio] Generated API documentation for ${components.length} components`
  )

  return Promise.all(promises).then(() => {
    console.timeEnd('[sui-studio] API generation took')
  })
}
