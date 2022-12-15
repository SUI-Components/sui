/* eslint-disable no-console */

const glob = require('fast-glob')
const {resolve, dirname, join} = require('node:path')
const {readFile, stat, rename, writeFile} = require('node:fs/promises')
const pattern = /export default(?: function)? ([$A-Z_][0-9A-Z_$]*)/i

const extractComponeName = content => {
  const match = content.match(pattern)
  if (!match) return null

  const componentName = match[1]

  return componentName ?? null
}

const hasMultipleExports = content => {
  const match = content.match(/^export /gm)

  if (!match) return null

  return match.length > 1
}

const checkFileExists = path => {
  return stat(path)
    .then(() => true)
    .catch(() => false)
}

const migrateComponentFiles = async () => {
  const files = await glob(['components/**/index.js'], {
    ignore: ['**/node_modules/**', '**/demo/**', '**/lib/**']
  })

  for (const file of files) {
    // File path is relative to CWD
    const absolutePath = resolve(process.cwd(), file)
    const content = (await readFile(absolutePath)).toString('utf8')
    const componentName = extractComponeName(content)

    if (!componentName) continue

    const dir = dirname(absolutePath)
    const newPath = join(dir, `${componentName}.js`)

    if (await checkFileExists(newPath)) {
      console.log(`file exists: ${newPath}`)
      continue
    } else {
      console.log('Does not exists')
    }

    await rename(absolutePath, newPath)

    const indexTemplate =
      [
        `import ${componentName} from './${componentName}.js'`,
        `export default ${componentName}`,
        hasMultipleExports(content) && `export * from './${componentName}.js'`
      ]
        .filter(Boolean)
        .join('\n') + '\n'

    await writeFile(absolutePath, indexTemplate)
  }
}

migrateComponentFiles()
