function getDecoratorsByNode(node, {isAClass, isAMethod, isArrowFunction}) {
  if (isAClass) {
    return node.decorators
  }

  if (isArrowFunction) {
    const methodNode = node.parent
    return methodNode.decorators ?? []
  }

  if (isAMethod) {
    return node.decorators ?? []
  }

  return []
}

function getElementName(node, {isAClass, isAMethod, isArrowFunction}) {
  if (isAClass) {
    const className = node?.id?.name ?? 'UnknownClass'
    return `${className}`
  }

  if (isArrowFunction) {
    const methodNode = node.parent
    const classNode = methodNode?.parent?.parent
    const className = classNode?.id?.name ?? 'UnknownClass'
    const methodName = methodNode.key?.name ?? 'UnknownMethod'

    return `${className}.${methodName}`
  }

  if (isAMethod) {
    const classNode = node.parent?.parent
    const className = classNode?.id?.name ?? 'UnknownClass'
    const methodName = node.key?.name ?? 'UnknownMethod'

    return `${className}.${methodName}`
  }

  return 'unknown'
}

function getElementMessageName(elementName, {isAClass, isAMethod, isArrowFunction}) {
  if (isAClass) {
    return `class ${elementName}`
  }

  if (isAMethod || isArrowFunction) {
    return `method ${elementName}`
  }

  return 'Unknown'
}

function remarkElement(node, {isAClass, isAMethod, isArrowFunction}) {
  if (isAClass) {
    return node?.id
  }

  if (isArrowFunction) {
    const methodNode = node.parent
    return methodNode.key
  }

  if (isAMethod) {
    return node.key
  }

  return node
}

module.exports.getDecoratorsByNode = getDecoratorsByNode
module.exports.getElementMessageName = getElementMessageName
module.exports.getElementName = getElementName
module.exports.remarkElement = remarkElement
