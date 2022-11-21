const path = require('node:path')
const fg = require('fast-glob')
const fs = require('fs-extra')
const reactDocs = require('react-docgen')
const findExportedExpressions = require('./findExportedExpressions.js')

module.exports = function generateApiDocs() {
  console.log('[sui-studio] Generating API documentation for components...')
  console.time('[sui-studio] API generation took')

  const components = fg.sync('components/*/*/src/index.js', {deep: 4})

  components.forEach(file => {
    let docFilePath = file
    const {dir} = path.parse(file)
    const gen = findExportedExpressions(file)
    const {route, found} = gen
    if (found) {
      docFilePath = route.split().join('')
    }

    const source = fs.readFileSync(docFilePath, 'utf-8')

    let docs = {}

    try {
      docs = reactDocs.parse(
        source,
        reactDocs.resolver.findAllComponentDefinitions
      )
    } catch (e) {
      console.warn(`[sui-studio] Couldn't generate API docs for ${file}`)
    }

    const outputFile = dir.replace('src', '') + 'definitions.json'
    fs.writeFileSync(
      path.resolve(process.cwd(), `public/${outputFile}`),
      JSON.stringify(docs, null, 2)
    )
  })

  console.timeEnd('[sui-studio] API generation took')
}
