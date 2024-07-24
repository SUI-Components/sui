/**
 * @fileoverview Ensure that method using @Deprecated() displays a warning alert
 */
'use strict'

const dedent = require('string-dedent')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function getElementName(node, {isAClass, isAMethod, isArrowFunction}) {
  if (isAClass) {
    const className = node.id?.name ?? 'UnknownClass'
    return `class ${className}`
  }

  if (isArrowFunction) {
    const methodNode = node.parent
    const classNode = methodNode?.parent?.parent
    const className = classNode.id?.name ?? 'UnknownClass'
    const methodName = methodNode.key?.name ?? 'UnknownMethod'

    return `method ${className}.${methodName}`
  }

  if (isAMethod) {
    const classNode = node.parent?.parent
    const className = classNode.id?.name ?? 'UnknownClass'
    const methodName = node.key?.name ?? 'UnknownMethod'

    return `method ${className}.${methodName}`
  }

  return 'unknown'
}

function getDecoratorsNode(node, {isAClass, isAMethod, isArrowFunction}) {
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

function remarkElement(node, {isAClass, isAMethod, isArrowFunction}) {
  if (isAClass) {
    return node.id
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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure that method using @Deprecated() displays a warning alert',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: 'code',
    schema: [],
    messages: {
      remarkWarningMessage: dedent`
        The {{methodName}} is marked as a deprecated.
      `
    }
  },
  create: function (context) {
    function highlightNode(node) {
      const isAClass = node.type === 'ClassDeclaration'
      const isArrowFunction = node.type === 'ArrowFunctionExpression'
      const isAMethod = node.type === 'MethodDefinition'

      const nodeName = getElementName(node, {isAClass, isAMethod, isArrowFunction})
      const decorators = getDecoratorsNode(node, {isAClass, isAMethod, isArrowFunction})
      const hasDecorators = decorators?.length > 0

      // Get the @Deprecated() decorator from node decorators
      const deprecatedDecoratorNode =
        hasDecorators && decorators?.find(decorator => decorator?.expression?.callee?.name === 'Deprecated')

      if (!deprecatedDecoratorNode) return
      console.log(nodeName, deprecatedDecoratorNode)

      const nodeToRemark = remarkElement(node, {isAClass, isAMethod, isArrowFunction})

      // RULE: Mark method with a warning
      context.report({
        node: nodeToRemark,
        messageId: 'remarkWarningMessage',
        data: {
          methodName: nodeName
        }
      })
    }

    return {
      ClassDeclaration: highlightNode,
      ArrowFunctionExpression: highlightNode,
      MethodDefinition: highlightNode
    }
  }
}
