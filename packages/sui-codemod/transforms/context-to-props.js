const EMPTY = 0

// TODO: ESTO NO FUNCIONA CON LAS DEFINICIONES ESTATICAS DE PROPS Y CONTEXT

module.exports = (file, api, options) => {
  const j = api.jscodeshift
  const root = j(file.source)
  const contextTypes = root.find(j.AssignmentExpression, {
    left: {property: {name: 'contextTypes'}}
  })

  if (contextTypes.length === EMPTY) {
    // Si no se usa el contexto no hay nada que hacer aquí
    return null
  }

  // cambiamos todas los usos de this.context por this.props
  root.find(j.Identifier).forEach(path => {
    if (path.node.name === 'context') {
      j(path).replaceWith(j.identifier('props'))
    }
  })

  const propTypes = root.find(j.AssignmentExpression, {
    left: {property: {name: 'propTypes'}}
  })

  if (propTypes.length !== EMPTY && contextTypes.length !== EMPTY) {
    // los propsTypes ahora incluyen también las antiguas contextTypes
    propTypes.get().value.right.properties = [
      ...propTypes.get().value.right.properties,
      ...contextTypes.get().value.right.properties
    ]
    // Borrar la definicion the contextTypes por que es legacy
    contextTypes.forEach(path => j(path).remove())
  }

  // Que pasa si no tenemos propTypes pero si contextTypes ?!?!
  // Que renombramos contextTypes -> propTypes
  if (propTypes.length === EMPTY && contextTypes.length !== EMPTY) {
    root.find(j.Identifier).forEach(path => {
      if (path.node.name === 'contextTypes') {
        j(path).replaceWith(j.identifier('propTypes'))
      }
    })
  }

  // en las declaraciones de componentes funcionales
  // mover el contexto a la props
  const exportDefaultDeclaration = root.find(j.ExportDefaultDeclaration).get()
  const componentDeclarationArrowFunction = root.find(j.VariableDeclarator, {
    id: {name: exportDefaultDeclaration.get().value.declaration.name},
    init: {type: 'ArrowFunctionExpression'}
  })

  if (componentDeclarationArrowFunction.length !== EMPTY) {
    const [
      propsParams,
      contextParams
    ] = componentDeclarationArrowFunction.get().value.init.params

    // Si está definido el objeto de propiedades, mergearlo con el de context
    if (
      propsParams &&
      propsParams.type === 'ObjectPattern' &&
      contextParams &&
      contextParams.type === 'ObjectPattern'
    ) {
      propsParams.properties = [
        ...propsParams.properties,
        ...contextParams.properties
      ]
      contextParams.properties = []
      componentDeclarationArrowFunction.get().value.init.params = [propsParams]
    }

    // Si no está defino y solo hay un placeholder (_, {domain}) => {} , reemplazar el placeholder por el contexto
    // ({i18n}) => {}
    if (
      propsParams &&
      propsParams.type === 'Identifier' &&
      contextParams &&
      contextParams.type === 'ObjectPattern'
    ) {
      componentDeclarationArrowFunction.get().value.init.params = [
        contextParams
      ]
    }
  }

  return root.toSource()
}
