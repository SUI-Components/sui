const { dirname, extname, join } = require('path')
const { existsSync } = require('fs')

function transformer(file, api, options) {
    const originalFilePath = dirname(file.path)

    const j = api.jscodeshift;

    // ------------------------------------------------------------------ SEARCH
    const nodes = j(file.source)
        .find(j.VariableDeclaration, {
            declarations: [
                {
                    init: {
                        type: "CallExpression",
                        callee: {
                            name: "require"
                        }
                        // property
                    }
                }
            ]
        })

    // ----------------------------------------------------------------- REPLACE
    return nodes
        .replaceWith((path) => {
          console.log('---')

          const requiredFilePath = path.node.declarations[0].init.arguments[0].value
          console.log({requiredFilePath})
        
          const hasExtension = extname(requiredFilePath) !== ''

          // if hasExtension, then do nothing
          if (hasExtension) {
            console.log('✅ File already has an extension. So leave it as it is.')
            return path.node
          }

          // if no extension, then add .js
          const withExtensionPath = join(process.cwd(), originalFilePath, `${requiredFilePath}.js`)
          console.log('Checking if it exists with a file extension .js...')
          console.log(`Checking ${withExtensionPath}...`)
  
          if (existsSync(withExtensionPath)) {
            console.log('✅')
            path.node.declarations[0].init.arguments[0].value = `${requiredFilePath}.js`
            return path.node
          }

          // if we're here, then it should be a ./index.js
          const withIndexPath = join(process.cwd(), originalFilePath, `${requiredFilePath}/index.js`)
          console.log('Checking if it is a index.js...')
          console.log(`Checking ${withIndexPath}...`)
  
          if (existsSync(withIndexPath)) {
            console.log('✅')
            path.node.declarations[0].init.arguments[0].value = `${requiredFilePath}/index.js`
            return path.node
          }

          return path.node
        })
        .toSource();
}

export default transformer;