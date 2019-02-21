const EMPTY = 0

module.exports = (file, api, options) => {
  const j = api.jscodeshift
  const root = j(file.source)
  const contextTypes = root.find(j.AssignmentExpression, {
    left: {property: {name: 'contextTypes'}}
  })

  const contextTypesStatics = root.find(j.ClassProperty, {
    key: {name: 'contextTypes'}
  })

  if (contextTypes.length === EMPTY && contextTypesStatics.length === EMPTY) {
    // Si no se usa el contexto no hay nada que hacer aquí
    return null
  }

  // cambiamos todas los usos de this.context por this.props
  // TODO: Avisar si el nombre de una prop colisiona con el nombre de un contexto
  root.find(j.Identifier).forEach(path => {
    if (path.node.name === 'context') {
      j(path).replaceWith(j.identifier('props'))
    }
  })

  const propTypes = root.find(j.AssignmentExpression, {
    left: {property: {name: 'propTypes'}}
  })

  const propTypesStatics = root.find(j.ClassProperty, {
    key: {name: 'propTypes'}
  })

  // Component.propTypes = {}
  // Component.contextTypes = {}
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
  // Component.contextTypes = {}
  if (propTypes.length === EMPTY && contextTypes.length !== EMPTY) {
    root.find(j.Identifier).forEach(path => {
      if (path.node.name === 'contextTypes') {
        j(path).replaceWith(j.identifier('propTypes'))
      }
    })
  }

  // propiedades y contexto definidos como miembros estáticos de la clase
  // static propTypes = {}
  // static contextTypes = {}
  if (
    propTypesStatics.length !== EMPTY &&
    contextTypesStatics.length !== EMPTY
  ) {
    propTypesStatics.get().node.value.properties = [
      ...propTypesStatics.get().node.value.properties,
      ...contextTypesStatics.get().node.value.properties
    ]
    // Borrar la definicion the contextTypesStatics por que es legacy
    contextTypesStatics.forEach(path => j(path).remove())
  }

  // SOLO contexto definido como miembro estático de la clase
  // static contextTypes = {}
  if (
    propTypesStatics.length === EMPTY &&
    contextTypesStatics.length !== EMPTY
  ) {
    root.find(j.Identifier).forEach(path => {
      if (path.node.name === 'contextTypes') {
        j(path).replaceWith(j.identifier('propTypes'))
      }
    })
  }

  // en las declaraciones de componentes funcionales
  // mover el contexto a la props
  // Podemos exportar por defecto una arrow function
  const exportDefaultDeclarationNodes = root.find(j.ExportDefaultDeclaration)
  const exportDefaultArrowDeclarationName =
    exportDefaultDeclarationNodes.length &&
    exportDefaultDeclarationNodes.get().value.declaration.name

  // Podeos exportar por defecto una funcion es5
  const exportDefaultFunctionDeclarationName =
    exportDefaultDeclarationNodes.length &&
    exportDefaultDeclarationNodes.get().value.declaration.id &&
    exportDefaultDeclarationNodes.get().value.declaration.id.name

  // podemos exportar nombrada una arrow function
  const exportNamedDeclarationNodes = root.find(j.ExportNamedDeclaration)
  const exportNamedDeclarationName =
    !exportDefaultArrowDeclarationName &&
    exportNamedDeclarationNodes.length &&
    ((exportNamedDeclarationNodes.get().value.declaration.id &&
      exportNamedDeclarationNodes.get().value.declaration.id.name) ||
      exportNamedDeclarationNodes.get().value.declaration.declarations[0].id
        .name)

  const componentDeclarationArrowFunction = root.find(j.VariableDeclarator, {
    id: {name: exportDefaultArrowDeclarationName || exportNamedDeclarationName},
    init: {type: 'ArrowFunctionExpression'}
  })

  const componentDeclarationES5Function = root.find(j.FunctionDeclaration, {
    id: {name: exportDefaultFunctionDeclarationName}
  })

  if (
    componentDeclarationArrowFunction.length !== EMPTY ||
    componentDeclarationES5Function.length !== EMPTY
  ) {
    const [propsParams, contextParams] =
      componentDeclarationArrowFunction.length !== EMPTY
        ? componentDeclarationArrowFunction.get().value.init.params
        : componentDeclarationES5Function.get().value.params

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
      componentDeclarationArrowFunction.length &&
        (componentDeclarationArrowFunction.get().value.init.params = [
          propsParams
        ])
      componentDeclarationES5Function.length &&
        (componentDeclarationES5Function.get().value.params = [propsParams])
    }

    // Si no está defino y solo hay un placeholder (_, {domain, i18n}) => {} , crear una deconstrucción incluyendo el contexto
    // ({domain, i18n, ..._}) => {}
    if (
      propsParams &&
      propsParams.type === 'Identifier' &&
      contextParams &&
      contextParams.type === 'ObjectPattern'
    ) {
      contextParams.properties = [
        ...contextParams.properties,
        {
          type: 'RestElement',
          argument: {type: 'Identifier', name: propsParams.name}
        }
      ]
      componentDeclarationArrowFunction.length &&
        (componentDeclarationArrowFunction.get().value.init.params = [
          contextParams
        ])
      componentDeclarationES5Function.length &&
        (componentDeclarationES5Function.get().value.params = [contextParams])
    }

    // Si ambos son una Identificar:
    // (props, context) => {}
  }

  return root.toSource()
}
