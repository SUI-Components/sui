/**
 * @fileoverview ensure value object has a value attribute
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
      description: 'Ensure value object has a value attribute',
      recommended: false,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      missingValueAttribute: dedent`
        If your class is a value object, you have to define a 'value' attribute.
      `,
      missingPrivateValueAttribute: dedent`
        The 'value' attribute has to be private.
      `,
      missingValueAttributeGetter: dedent`
        The 'value' attribute has to have a getter.
        You can define a native getter (get {{attributeName}}) or a custom getter ({{customGetterName}}).
      `
    }
  },

  // If your class is a value object, you have to define a private 'value' attribute and the associated getter.

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
        const className = node?.id?.name ?? ''
        const allowedWords = ['VO', 'ValueObject', 'Entity']
        const isDomainModelName = allowedWords.some(allowWord => className.includes(allowWord))

        if (!isDomainModelName && !isValueObjectPath) return
        if (!isDomainModelName && !isEntityPath) return

        const attributes = node.body.body.filter(node => {
          return node?.type === 'PropertyDefinition' && node?.value?.type !== 'ArrowFunctionExpression'
        })

        if (attributes.length > 1) return

        // Check if exists value attribute
        const valueAttribute = node?.body?.body?.find(node => {
          return node?.type === 'PropertyDefinition' && node?.key?.name === 'value'
        })

        if (!valueAttribute) {
          return context.report({
            node: node?.id,
            messageId: 'missingValueAttribute'
          })
        }

        // Check if value attribute is private

        const isPrivateValueAttribute = valueAttribute?.key?.type === 'PrivateIdentifier'

        if (!isPrivateValueAttribute) {
          return context.report({
            node: node?.id,
            messageId: 'missingPrivateValueAttribute'
          })
        }

        // Check if a value attribute has a public accessor
        const classMethods = node.body.body.filter(node => {
          return node?.type === 'MethodDefinition' || node?.value?.type === 'ArrowFunctionExpression'
        })

        let hasGetter = false
        const customGetterName = `get
          ${valueAttribute?.key?.name?.charAt(0).toUpperCase()}
          ${valueAttribute?.key?.name?.slice(1)}
        `

        classMethods.forEach(method => {
          const existNativeGetterWithAttributeKey = 
            method?.key?.name === valueAttribute?.key?.name &&
            method?.kind === 'get'
          const existCustomGetterWithAttributeKey = method?.key?.name === customGetterName

          if (existNativeGetterWithAttributeKey || existCustomGetterWithAttributeKey) {
            hasGetter = true
          }
        })

        if (!hasGetter) {
          context.report({
            node: valueAttribute,
            messageId: 'missingValueAttributeGetter',
            data: {
              attributeName: valueAttribute?.key?.name,
              customGetterName
            }
          })
        }
      }
    }
  }
}
