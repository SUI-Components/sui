// TODO: ESTO NO FUNCIONA CON LAS DEFINICIONES ESTATICAS DE PROPS Y CONTEXT

const fg = require('fast-glob')
const babelParser = require('@babel/parser')
const fs = require('fs')
const path = require('path')

const inRootFolder = file => file.path.match(/\/src\/\w+\.js$/)
const insideFolder = file => file.path.match(/\/src\/\w+\/\w+\.js$/)
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

const hasContext = file =>
  Boolean(
    file.ast.program.body.find(
      node =>
        node.type === 'ExpressionStatement' &&
        node.expression.type === 'AssignmentExpression' &&
        node.expression.left.property.name === 'contextTypes'
    )
  )

const indexTemplate = file =>
  `
import React from 'react'
import SUIContext from '@s-ui/context'

import Component from './component'

const ${file.name} = props => (
  <SUIContext.Consumer>
    {context => <Component {...context} {...this.props} />}
  </SUIContext.Consumer>
)

${file.name}.displayName = '${file.name}'

export default ${file.name}
`.trim()

const pathPseudoRelative = base => (literals, ...values) => {
  let string = ''

  for (let [index, value] of values.entries()) {
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
          plugins: ['jsx', 'classProperties', 'objectRestSpread']
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
      // .filter((_, index) => index === 1)
      .forEach(moveFileToFolder({dry}))

    filesToMove
      .filter(notEntryComponent)
      .filter(insideFolder)
      // TODO: DESCOMENTA ESTO!!!!!!!!
      // .filter(file => file.hasContext)
      // .filter((_, index) => index === 1)
      .forEach(applyIndexComponentPattern({dry}))

    filesToMove
      .filter(isRootComponent)
      .forEach(applyIndexComponentPatternInRootFile({dry}))
  }
}
