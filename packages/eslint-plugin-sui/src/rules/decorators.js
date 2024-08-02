/**
 * @fileoverview Ensure that at least all your UseCases are using the @tracer decorator from sui
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
      description: 'Ensure that at least all your UseCases are using the @tracer decorator from sui',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingTracer: dedent`
        All our UseCases must have a @tracer() decorator.
      `,
      tracerMissCall: dedent`
        Your tracer decorator should be call always with the name of your class
      `
    }
  },
  create: function (context) {
    return {
      MethodDefinition(node) {
        const className = node.parent?.parent?.id?.name
        const shouldExtendFromUseCase = node.parent?.parent?.superClass?.name === 'UseCase'
        const isExecute = node.key?.name === 'execute' && shouldExtendFromUseCase
        const tracerNode = node.decorators?.find(node => node.expression?.callee?.name === 'tracer')
        const isTracerCalledWithClassName =
          tracerNode?.expression?.callee?.name === 'tracer' &&
          className + '#' + node.key?.name === tracerNode?.expression?.arguments[0]?.properties[0]?.value?.value &&
          tracerNode?.expression?.arguments[0]?.properties[0]?.key?.name === 'metric'

        isExecute &&
          !tracerNode &&
          context.report({
            node: node.key,
            messageId: 'missingTracer'
          })

        tracerNode &&
          !isTracerCalledWithClassName &&
          context.report({
            node: tracerNode,
            messageId: 'tracerMissCall',
            fix(fixer) {
              return fixer.replaceText(tracerNode.expression, `tracer({metric: '${className}#${node.key?.name}'})`)
            }
          })
      }
    }
  }
}
