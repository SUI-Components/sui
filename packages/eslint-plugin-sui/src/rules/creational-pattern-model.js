/**
 * @fileoverview ensure entity createFromPrimitive mMethod
 */
'use strict'

const dedent = require('string-dedent')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure domain models have createFromPrimitives method',
      recommended: false,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      missingCreateFromPrimitivesMethod: dedent`
        If your class is a domain model (Value Object or Entity), you have to define a 'static createFromPrimitives' method.
      `,
      missingCreateFromPrimitivesMethodStatic: dedent`
        The createFromPrimitives method should be static
      `
    }
  },

  create(context) {
    return {
      ClassDeclaration(node) {
        const createFromPrimitives = node.body.body.find(i => i.key.name === 'createFromPrimitives')

        const className = node?.id?.name ?? ''

        const allowedWords = ['VO', 'ValueObject', 'Entity']

        const isDomainModel = allowedWords.some(allowWord => className.includes(allowWord))

        if (!isDomainModel) return // eslint-disable-line

        if (!createFromPrimitives)
          return context.report({
            node: node.id,
            messageId: 'missingCreateFromPrimitivesMethod'
          })

          const hasStaticModifier = createFromPrimitives.static

        if(!hasStaticModifier)
          return context.report({
            node: createFromPrimitives,
            messageId: 'missingCreateFromPrimitivesMethodStatic'
          })
      }
    }
  }
}
