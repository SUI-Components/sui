// This script is an AST babylon parse. It identify the "describe.context.[whatever]" Call statement and adds
// a final parameter which includes the component name in order to enhance it and provide the right one for the
// appropiate test.

module.exports = function(babel) {
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const t = babel.types
  return {
    visitor: {
      CallExpression: function(path, state) {
        if (
          path.node.callee.type === 'MemberExpression' &&
          path.node.callee.object.type === 'MemberExpression' &&
          path.node.callee.object.property.name === 'context' &&
          path.node.callee.object.object.type === 'Identifier' &&
          path.node.callee.object.object.name === 'describe' &&
          path.node.arguments.length === 2
        ) {
          const propertyName = path.node.callee.property.name
          const args = path.node.arguments
          const ComponentName = state.file.opts.filename
            .replace(`${state.file.opts.cwd}/test/`, '')
            .split('/')
            .slice(0, 2)
            .map(capitalize)
            .join('')
          path.replaceWith(
            t.callExpression(
              t.memberExpression(
                t.memberExpression(
                  t.identifier('describe'),
                  t.identifier('context')
                ),
                t.identifier(propertyName)
              ),
              [...args, t.stringLiteral(ComponentName)]
            )
          )
        }
      }
    }
  }
}
