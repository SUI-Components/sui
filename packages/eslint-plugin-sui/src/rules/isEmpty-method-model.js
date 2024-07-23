/**
 * @fileoverview ensure domain model has isEmpty method when we can create it without validation
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
      description: 'Ensure domain model has isEmpty method when we can create it without validation',
      recommended: false,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      missingIsEmptyMethod: dedent`
        If your class is a domain model (Value Object or Entity), and the constructor has a skipValidation param you have to define a 'isEmpty' method.
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
        const constructor = node.body?.body?.find(i => i.key.name === 'constructor')

        const className = node.id?.name ?? ''

        const allowedWords = ['VO', 'ValueObject', 'Entity']

        const isDomainModelName = allowedWords.some(allowWord => className.includes(allowWord))

        if (!isDomainModelName && !isValueObjectPath) return
        if (!isDomainModelName && !isEntityPath) return

        if (!constructor) return

        const hasConstructorSkipValidationParam = constructor.value?.params[0]?.properties?.some(param => {
          return param.key?.name === 'skipValidation'
        })

        if (!hasConstructorSkipValidationParam) return

        const classMethods = node.body.body.filter(node => {
          return node.type === 'MethodDefinition' || node.value?.type === 'ArrowFunctionExpression'
        })

        const hasIsEmptyMethod = classMethods.some(i => i.key.name === 'isEmpty')

        if (!hasIsEmptyMethod)
          return context.report({
            node: node.id,
            messageId: 'missingIsEmptyMethod'
          })
      }
    }
  }
}
