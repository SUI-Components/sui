/**
 * @fileoverview Ensure that @Deprecated() decorator is used as expected
 */
'use strict'

const dedent = require('string-dedent')

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
    // TODO: Check using decorator in a Class.
    return {
      MethodDefinition(node) {
        // Method
        const method = node
        const methodName = method.key?.name

        // Method decorators
        const methodDecorators = method.decorators
        const hasDecorators = methodDecorators?.length > 0

        if (!hasDecorators) return

        // Get the @Deprecated() decorator from method
        const deprecatedDecoratorNode =
          hasDecorators && methodDecorators?.find(decorator => decorator?.expression?.callee?.name === 'Deprecated')

        if (!deprecatedDecoratorNode) return

        const methodArguments = deprecatedDecoratorNode?.expression?.arguments
        const hasArgument = methodArguments.length === 1
        const argumentDecorator = hasArgument && methodArguments[0]
        const isObjectExpression = hasArgument && argumentDecorator.type === 'ObjectExpression'
        const argumentsAreInvalid = !hasArgument || !isObjectExpression

        // Get decorator arguments: key and message
        const keyProperty =
          !argumentsAreInvalid && argumentDecorator.properties?.find(prop => prop?.key?.name === 'key')
        const messageProperty =
          !argumentsAreInvalid && argumentDecorator.properties?.find(prop => prop?.key?.name === 'message')

        // RULE: Decorator must have 1 argument as an object with Key and Message properties
        if (argumentsAreInvalid || (!keyProperty && !messageProperty)) {
          context.report({
            node: deprecatedDecoratorNode,
            messageId: 'notFoundDecoratorArgumentError',
            *fix(fixer) {
              yield fixer.insertTextBefore(
                deprecatedDecoratorNode,
                `\n  @Deprecated({key: '${methodName}', message: 'The ${methodName} function is deprecated.'})`
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
                `\n  @Deprecated({key: '${methodName}', message: '${messageProperty.value.value}'})`
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
                `\n  @Deprecated({key: '${keyProperty.value.value}', message: 'The ${methodName} function is deprecated.'})`
              )
              yield fixer.remove(deprecatedDecoratorNode)
            }
          })
        }
      }
    }
  }
}
