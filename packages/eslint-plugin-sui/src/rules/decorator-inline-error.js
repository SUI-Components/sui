/**
 * @fileoverview Ensure the right usage of @AsyncInlineError decorator from sui in sui-domain
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
      description: 'Ensure the right usage of @AsyncInlineError decorator from sui in sui-domain',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: 'code',
    schema: [],
    messages: {
      replaceInlineErrorWithAsyncInlineError: dedent`
        The @inlineError decorator is deprecated. Use the @AsyncInlineError() decorator instead.
        `,
      asyncInlineErrorDecoratorIsNotLast: dedent`
        The @AsyncInlineError() decorator must always be closest to the method to avoid inconsistencies with other decorators.
        `
    }
  },
  create: function (context) {
    const sourceCode = context.getSourceCode()
    let hasAddedImport = false

    function addAsyncInlineErrorImport(fixer) {
      if (
        !hasAddedImport &&
        !sourceCode.ast.body.some(
          node =>
            node.type === 'ImportDeclaration' &&
            node.source.value === '@s-ui/decorators' &&
            node.specifiers.some(spec => spec.imported.name === 'AsyncInlineError')
        )
      ) {
        hasAddedImport = true
        return fixer.insertTextBefore(sourceCode.ast.body[0], "import { AsyncInlineError } from '@s-ui/decorators';\n")
      }
      return null
    }

    function getNodeIndent(node) {
      const token = sourceCode.getFirstToken(node)
      const lineStartIndex = sourceCode.getIndexFromLoc({line: token.loc.start.line, column: 0})
      const textBeforeToken = sourceCode.text.slice(lineStartIndex, token.range[0])
      return textBeforeToken.match(/^\s*/)[0]
    }

    return {
      Program() {
        hasAddedImport = false
      },
      Decorator(node) {
        const methodDefinition = node.parent
        const decorators = methodDefinition.decorators || []
        const indent = getNodeIndent(methodDefinition)

        if (node.expression.type === 'Identifier' && node.expression.name === 'inlineError') {
          context.report({
            node,
            messageId: 'replaceInlineErrorWithAsyncInlineError',
            fix(fixer) {
              const fixes = [fixer.replaceText(node, '@AsyncInlineError()'), addAsyncInlineErrorImport(fixer)]
              return fixes.filter(Boolean)
            }
          })
        } else if (
          node.expression.type === 'CallExpression' &&
          node.expression.callee.name === 'AsyncInlineError' &&
          decorators.indexOf(node) !== decorators.length - 1
        ) {
          context.report({
            node,
            messageId: 'asyncInlineErrorDecoratorIsNotLast',
            fix(fixer) {
              const lastDecorator = decorators[decorators.length - 1]
              return [fixer.remove(node), fixer.insertTextAfter(lastDecorator, `\n${indent}@AsyncInlineError()`)]
            }
          })
        }
      }
    }
  }
}
