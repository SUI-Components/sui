const swcSettings = require('@s-ui/js-compiler/swc-config.js')
const {parseSync, transformFileSync} = require('@swc/core')
const path = require('node:path')

function findExportedExpressions(file, {isDefault = true, variableName} = {}) {
  const {dir, base = 'index.js'} = path.parse(`${file}`)

  const {code: transformedCode} = transformFileSync(`${file}`, swcSettings)

  const AST = parseSync(transformedCode)

  if (typeof AST !== 'object') {
    throw new Error('invalid file data')
  }
  const {body} = AST
  const globalDeclarations = body.reduce(
    (
      acc,
      {
        type,
        source,
        id,
        declaration = {},
        declarations = [],
        specifiers = [],
        identifier = {}
      }
    ) => {
      if (type === 'ExportNamedDeclaration' && source !== null) {
        const {value, type} = source
        if (type === 'StringLiteral') {
          specifiers?.forEach(({type, orig, exported}) => {
            if (['ExportDefaultSpecifier', 'ExportSpecifier'].includes(type)) {
              acc = {
                ...acc,
                [exported?.value || orig?.value]: {
                  localName: orig?.value,
                  currentName: exported?.value || orig?.value,
                  source:
                    path.relative(process.cwd(), path.resolve(dir, value)) ||
                    `${dir}/${base}`
                }
              }
            }
          })
        }
      }
      if (type === 'ExportDeclaration') {
        const {declarations = []} = declaration
        declarations.forEach(({id: {value}}) => {
          acc = {
            ...acc,
            [value]: {localName: value, source: `${dir}/${base}`}
          }
        })
      }
      if (type === 'VariableDeclaration') {
        declarations.forEach(({id: {value}} = {id: {}}) => {
          acc = {...acc, [value]: {localName: value, source: `${dir}/${base}`}}
        })
      }
      if (['FunctionDeclaration', 'ClassDeclaration'].includes(type)) {
        const {value} = identifier
        acc = {...acc, [value]: {localName: value, source: `${dir}/${base}`}}
      }
      if (type === 'ImportDeclaration' && source !== null) {
        const {value, type} = source
        if (type === 'StringLiteral') {
          specifiers?.forEach(({type, local, imported}, i) => {
            if (['ImportDefaultSpecifier', 'ImportSpecifier'].includes(type)) {
              acc = {
                ...acc,
                [imported?.value || local?.value]: {
                  localName: local?.value,
                  importedName: imported?.value || local?.value,
                  source:
                    path.relative(process.cwd(), path.resolve(dir, value)) ||
                    `${dir}/${base}`
                }
              }
            }
          })
        }
      }
      return acc
    },
    {}
  )

  let result = body.find(({type, specifiers}) => {
    if (type === 'ExportDefaultDeclaration' && isDefault) {
      return true
    }
    if (type === 'ExportNamedDeclaration') {
      specifiers?.forEach(({type, orig, exported}) => {
        if (type === 'ExportSpecifier') {
          const currentName = exported?.value || orig?.value
          if (variableName === currentName) {
            return true
          }
        }
      })
    }
    if (
      type === 'ExportDefaultExpression' &&
      (variableName === undefined || isDefault)
    ) {
      return true
    }
  })
  result = (({type, expression, specifiers}) => {
    if (type === 'ExportDefaultDeclaration' && isDefault) {
      return {route: path.resolve(dir, base), found: true, isDefault: true}
    } else if (type === 'ExportNamedDeclaration') {
      specifiers?.forEach(({type, orig, exported}) => {
        if (type === 'ExportSpecifier') {
          const currentName = exported?.value || orig?.value
          if (variableName === currentName) {
            return {
              isDefault: false,
              route: globalDeclarations[currentName].source,
              found: globalDeclarations[currentName].source === file,
              variableName: globalDeclarations[currentName].localName
            }
          }
        }
      })
    } else if (
      type === 'ExportDefaultExpression' &&
      variableName === undefined
    ) {
      const {value} = expression
      const {source, localName} = {...(globalDeclarations[value] || {})}
      return {
        route: source,
        found: source === file,
        variableName: localName
      }
    }
  })(result)
  if (!result) {
    result = {route: path.resolve(dir, base), found: false, isDefault: false}
  }
  if (!result.found && file !== result.route) {
    result = findExportedExpressions(result.route, {
      isDefault: result.isDefault,
      variableName: result.variableName
    })
  }
  return result
}

module.exports = findExportedExpressions
