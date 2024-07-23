/**
 * @fileoverview ensure domain model have a validate method
 */
'use strict'

const dedent = require('string-dedent')
const path = require('path')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure domain models have a validate method',
      recommended: false,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      missingValidateMethod: dedent`
        If your class is a domain model (Value Object or Entity), you have to define a 'static validate' method.
      `,
      missingValidateMethodStatic: dedent`
        The validate method should be static.
      `
    }
  },

  create(context) {
    const filePath = context.getFilename()
    const relativePath = path.relative(context.getCwd(), filePath)

    // Check if the file is inside requierd folders (useCases, services, repositories, ...)
    const valueObjectPattern = /valueObjects|valueobjects|ValueObjects|Valueobjects/i
    const isValueObjectPath = valueObjectPattern.test(relativePath)

    const entityPattern = /entity|Entity/i
    const isEntityPath = entityPattern.test(relativePath)

    return {
      ClassDeclaration(node) {
        const validateMethod = node.body?.body?.find(i => i.key?.name === 'validate')

        const className = node.id?.name ?? ''

        const allowedWords = ['VO', 'ValueObject', 'Entity']

        const isDomainModelName = allowedWords.some(allowWord => className.includes(allowWord))

        if (!isDomainModelName && !isValueObjectPath) return
        if (!isDomainModelName && !isEntityPath) return

        if (!validateMethod)
          return context.report({
            node: node.id,
            messageId: 'missingValidateMethod'
          })

        const hasStaticModifier = validateMethod.static

        if (!hasStaticModifier)
          return context.report({
            node: validateMethod,
            messageId: 'missingValidateMethodStatic'
          })
      }
    }
  }
}
