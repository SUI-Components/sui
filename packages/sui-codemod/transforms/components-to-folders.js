const fg = require('fast-glob')
const babelParser = require('@babel/parser')
const fs = require('fs')
const path = require('path')
const toPascalCase = require('just-pascal-case')

const inRootFolder = file => file.path.match(/\/src\/\w+\.js$/)
const insideFolder = file => file.path.match(/\/src\/.*\/\w+\.js$/)
const notEntryComponent = file => !file.path.match(/\/src\/index\.js$/)
const filenameComponent = file => !file.path.match(/component\.js$/)
const isRootComponent = file => file.path.match(/\/src\/index\.js$/)
const importReact = file =>
  file.ast.program.body.some(
    node => node.type === 'ImportDeclaration' && node.source.value === 'react'
  )
const componentName = file => {
  // Export Default
  const exportDefaultDeclaration = file.ast.program.body.find(
    node => node.type === 'ExportDefaultDeclaration'
  )
  if (
    exportDefaultDeclaration &&
    exportDefaultDeclaration.declaration &&
    exportDefaultDeclaration.declaration.name
  ) {
    return exportDefaultDeclaration.declaration.name
  }

  // export default class or function
  if (
    exportDefaultDeclaration &&
    exportDefaultDeclaration.declaration &&
    (exportDefaultDeclaration.declaration.type === 'ClassDeclaration' ||
      exportDefaultDeclaration.declaration.type === 'FunctionDeclaration') &&
    exportDefaultDeclaration.declaration.id
  ) {
    return exportDefaultDeclaration.declaration.id.name
  }

  // Export Named declaration
  const exportNamedDeclaration = file.ast.program.body.find(
    node => node.type === 'ExportNamedDeclaration'
  )
  if (
    exportNamedDeclaration &&
    exportNamedDeclaration.declaration &&
    exportNamedDeclaration.declaration &&
    exportNamedDeclaration.declaration.declarations &&
    exportNamedDeclaration.declaration.declarations[0].id
  ) {
    return exportNamedDeclaration.declaration.declarations[0].id.name
  }

  // DisplayName value
  const displayNameDeclaration = file.ast.program.body.find(
    node =>
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'AssignmentExpression' &&
      node.expression.left.property.name === 'displayName'
  )
  if (displayNameDeclaration) {
    return displayNameDeclaration.expression.right.value
  }

  // Nombre del fichero
  const filename = path.basename(file.path, '.js')
  const [, folder] = file.path.split(path.sep).reverse()
  return filename !== 'index' ? filename : folder
}

const hasContext = file => {
  return Boolean(
    file.ast.program.body.find(
      node =>
        // O una asignación sobre el contructor
        // Component.contextType = {}
        (node.type === 'ExpressionStatement' &&
          node.expression.type === 'AssignmentExpression' &&
          node.expression.left.property.name === 'contextTypes') ||
        // O una definición estática sobre la clase
        // class Component extends Component {
        //  static contextTypes = {}
        // }
        (node.type === 'ExportDefaultDeclaration' &&
          node.declaration.type === 'ClassDeclaration' &&
          node.declaration.body.type === 'ClassBody' &&
          node.declaration.body.body.some(
            classProperty => classProperty.key.name === 'contextTypes'
          ))
    )
  )
}

const indexTemplate = file =>
  `
import Component from './component'
import SUIContext from '@s-ui/react-context'

export default SUIContext.wrapper(Component, '${toPascalCase(file.name)}')

`.trim()

const pathPseudoRelative = base => (literals, ...values) => {
  let string = ''

  for (const [index, value] of values.entries()) {
    string += literals[index]
    string += value.replace(base, '')
  }

  return (string += literals[literals.length - 1])
}

const moveFileToFolder = ({dry}) => file => {
  const folderComponentPath = path.join(
    path.dirname(file.path),
    file.folder || file.name
  )
  const destinationComponentFilePath = path.join(
    path.dirname(file.path),
    file.folder || file.name,
    file.hasContext ? 'component.js' : 'index.js'
  )
  const templateFilePath = path.join(
    path.dirname(file.path),
    file.folder || file.name,
    'index.js'
  )

  if (dry) {
    console.log(pathPseudoRelative(process.cwd())`
Processed ${file.path}`)
    console.log(pathPseudoRelative(process.cwd())`\
      -> Created ${folderComponentPath} folder
      -> copied ${file.path} to ${destinationComponentFilePath}`)
    file.hasContext &&
      console.log(pathPseudoRelative(process.cwd())`\
      -> Wrote template file in ${templateFilePath}`)
    console.log(pathPseudoRelative(process.cwd())`\
      -> Removed ${file.path}
    `)
    return
  }

  fs.mkdirSync(folderComponentPath)
  fs.copyFileSync(file.path, destinationComponentFilePath)
  file.hasContext && fs.writeFileSync(templateFilePath, indexTemplate(file))
  fs.unlinkSync(file.path)
}

const applyIndexComponentPattern = ({dry}) => file => {
  const isIndexFile = path.basename(file.path, '.js') === 'index'
  const destinationComponentFilePath = path.join(
    path.dirname(file.path),
    'component.js'
  )
  const templateFilePath = path.join(path.dirname(file.path), 'index.js')

  if (dry) {
    console.log(pathPseudoRelative(process.cwd())`
Processed ${file.path}`)
    if (isIndexFile) {
      console.log(pathPseudoRelative(process.cwd())`\
      -> copied ${file.path} to ${destinationComponentFilePath}
      -> Wrote template file in ${templateFilePath}
    `)
      return
    }
  }

  if (isIndexFile) {
    fs.copyFileSync(file.path, destinationComponentFilePath)
    fs.writeFileSync(templateFilePath, indexTemplate(file))
  } else {
    moveFileToFolder({dry})({...file, folder: path.basename(file.path, '.js')})
  }
}

const applyIndexComponentPatternInRootFile = ({dry}) => file => {
  const destinationComponentFilePath = path.join(
    path.dirname(file.path),
    'component.js'
  )
  const templateFilePath = path.join(path.dirname(file.path), 'index.js')

  if (dry) {
    console.log(pathPseudoRelative(process.cwd())`
Processed ${file.path}`)
    !file.hasContext &&
      console.log(pathPseudoRelative(process.cwd())`\
      -> No Context nothing to change`)
    file.hasContext &&
      console.log(pathPseudoRelative(process.cwd())`\
      -> copied ${file.path} to ${destinationComponentFilePath}`)
    file.hasContext &&
      console.log(pathPseudoRelative(process.cwd())`\
      -> Removed ${file.path}`)
    file.hasContext &&
      console.log(pathPseudoRelative(process.cwd())`\
      -> Wrote template file in ${templateFilePath}`)
    return
  }

  if (file.hasContext) {
    fs.copyFileSync(file.path, destinationComponentFilePath)
    fs.unlinkSync(file.path)
    fs.writeFileSync(templateFilePath, indexTemplate(file))
  }
}

module.exports = {
  run: ({dry, path: components}) => {
    const [lastCharacter] = components
      .split('')
      .reverse()
      .join('')

    const entries = fg.sync([
      components + (lastCharacter === '/' ? '' : '/') + '**',
      '!**/node_modules/**',
      '!**/lib/**'
    ])

    const files = entries
      .filter(p => p.match(/\.js$/))
      .map(p => path.resolve(p))
      .map(p => {
        const ast = babelParser.parse(fs.readFileSync(p, {encoding: 'utf8'}), {
          allowImportExportEverywhere: true,
          plugins: [
            'jsx',
            'classProperties',
            'objectRestSpread',
            'dynamicImport'
          ]
        })
        return {path: p, ast}
      })

    const filesToMove = files
      .filter(importReact)
      .filter(filenameComponent)
      .map(file => ({
        ...file,
        name: componentName(file),
        hasContext: hasContext(file)
      }))

    filesToMove
      .filter(notEntryComponent)
      .filter(inRootFolder)
      .forEach(moveFileToFolder({dry}))

    filesToMove
      .filter(notEntryComponent)
      .filter(insideFolder)
      .filter(file => file.hasContext)
      .forEach(applyIndexComponentPattern({dry}))

    filesToMove
      .filter(isRootComponent)
      .forEach(applyIndexComponentPatternInRootFile({dry}))
  }
}
