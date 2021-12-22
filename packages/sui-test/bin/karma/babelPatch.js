/*
  This script is an AST babylon parse. It identify the "describe.context.[contextToUse]".
  Call statement and adds a final parameter which includes a Component Key based on the path.
  The Component Key will be used to get from `window.__STUDIO_CONTEXTS__` the correct Component and, then, using the `contextToUse`property to grab the correct context for the specific component.
*/
module.exports = function({types: t}) {
  return {
    visitor: {
      CallExpression: function(path, state) {
        const {
          node: {arguments: args, callee}
        } = path
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'MemberExpression' &&
          callee.object.property.name === 'context' &&
          callee.object.object.type === 'Identifier' &&
          callee.object.object.name === 'describe' &&
          args.length === 2
        ) {
          // extract from property.name the context we want to use
          const contextToUse = callee.property.name
          // extract category and component from the filename
          // by reversing the path and exlcuding the first slash (it's /index.js)
          const reversedPath = state.file.opts.filename.split('/').reverse()
          const [, lastPath] = reversedPath
          const isRelativeTestPath = lastPath === 'test'
          let componentKey = ''
          if (isRelativeTestPath) {
            const [, , component, category] = reversedPath
            componentKey = `${category}/${component}`
          } else {
            const [, component, category] = reversedPath
            componentKey = `${category}/${component}`
          }

          path.replaceWith(
            t.callExpression(
              t.memberExpression(
                t.memberExpression(
                  t.identifier('describe'),
                  t.identifier('context')
                ),
                t.identifier(contextToUse)
              ),
              [...args, t.stringLiteral(componentKey)]
            )
          )
        }
      }
    }
  }
}
