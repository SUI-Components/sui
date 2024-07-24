/**
 * @fileoverview Ensure that method using @Deprecated() displays a warning alert
 */
'use strict'

const dedent = require('string-dedent')
const {getDecoratorsByNode, getElementMessageName, getElementName, remarkElement} = require('../utils/decorators.js')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

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
      const decorators = getDecoratorsByNode(node, {isAClass, isAMethod, isArrowFunction})
      const hasDecorators = decorators?.length > 0

      // Get the @Deprecated() decorator from node decorators
      const deprecatedDecoratorNode =
        hasDecorators && decorators?.find(decorator => decorator?.expression?.callee?.name === 'Deprecated')

      if (!deprecatedDecoratorNode) return

      const elementMessageName = getElementMessageName(nodeName, {isAClass, isAMethod, isArrowFunction})
      const nodeToRemark = remarkElement(node, {isAClass, isAMethod, isArrowFunction})

      // RULE: Mark method with a warning
      context.report({
        node: nodeToRemark,
        messageId: 'remarkWarningMessage',
        data: {
          methodName: elementMessageName
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
