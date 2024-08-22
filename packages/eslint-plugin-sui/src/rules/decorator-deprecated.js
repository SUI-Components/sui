/**
 * @fileoverview Ensure that @Deprecated() decorator is used as expected
 */
'use strict'

const dedent = require('string-dedent')
const {getDecoratorsByNode, getElementName, getElementMessageName} = require('../utils/decorators')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure that @Deprecated() decorator is used as expected',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: 'code',
    schema: [],
    messages: {
      notFoundDecoratorArgumentError: dedent`
            The @Deprecated() decorator must have arguments.
        `,
      notFoundKeyDecoratorArgumentError: dedent`
            The @Deprecated() decorator must have a key property.
        `,
      notFoundMessageDecoratorArgumentError: dedent`
            The @Deprecated() decorator must have a message property.
        `
    }
  },
  create: function (context) {
    function ruleRunner(node) {
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

      const deprecatedDecoratorArguments = deprecatedDecoratorNode.expression?.arguments
      // The decorator must have 1 argument and it should be an object
      const hasArgument = deprecatedDecoratorArguments.length === 1
      const argumentDecorator = hasArgument && deprecatedDecoratorArguments[0]
      const isObjectExpression = hasArgument && argumentDecorator.type === 'ObjectExpression'
      const argumentsAreInvalid = !hasArgument || !isObjectExpression

      // Get decorator arguments: key and message
      const keyProperty = !argumentsAreInvalid && argumentDecorator.properties?.find(prop => prop?.key?.name === 'key')
      const messageProperty =
        !argumentsAreInvalid && argumentDecorator.properties?.find(prop => prop?.key?.name === 'message')

      const elementMessageName = getElementMessageName(nodeName, {isAClass, isAMethod, isArrowFunction})

      // RULE: Decorator must have 1 argument as an object with Key and Message properties
      if (argumentsAreInvalid || (!keyProperty && !messageProperty)) {
        context.report({
          node: deprecatedDecoratorNode,
          messageId: 'notFoundDecoratorArgumentError',
          *fix(fixer) {
            yield fixer.insertTextBefore(
              deprecatedDecoratorNode,
              `\n  @Deprecated({key: '${nodeName}', message: 'The ${elementMessageName} is deprecated.'})`
            )
            yield fixer.remove(deprecatedDecoratorNode)
          }
        })
        return
      }

      // RULE: Decorator must have a key property and generates it if it doesn't exist
      if (!keyProperty && messageProperty) {
        context.report({
          node: deprecatedDecoratorNode,
          messageId: 'notFoundKeyDecoratorArgumentError',
          *fix(fixer) {
            yield fixer.insertTextBefore(
              deprecatedDecoratorNode,
              `\n  @Deprecated({key: '${nodeName}', message: '${messageProperty.value.value}'})`
            )
            yield fixer.remove(deprecatedDecoratorNode)
          }
        })
      }

      // RULE: Decorator must have a message property and generates it if it doesn't exist
      if (keyProperty && !messageProperty) {
        context.report({
          node: deprecatedDecoratorNode,
          messageId: 'notFoundMessageDecoratorArgumentError',
          *fix(fixer) {
            yield fixer.insertTextBefore(
              deprecatedDecoratorNode,
              `\n  @Deprecated({key: '${keyProperty.value.value}', message: 'The ${elementMessageName} function is deprecated.'})`
            )
            yield fixer.remove(deprecatedDecoratorNode)
          }
        })
      }
    }

    return {
      ClassDeclaration: ruleRunner,
      MethodDefinition: ruleRunner,
      ArrowFunctionExpression: ruleRunner
    }
  }
}
