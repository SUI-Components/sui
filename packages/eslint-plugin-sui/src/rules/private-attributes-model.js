/**
 * @fileoverview ensure domain model have a private attributes and each attribute has a getter
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
      description: 'Ensure domain models have all attributes as private and each attribute has a getter',
      recommended: false,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      attributeHasToBePrivate: dedent`
        If your class is a domain model (Value Object or Entity), you have to define all attributes as private with #.
      `,
      privateAttributeHasToHaveGetter: dedent`
        If your class is a domain model (Value Object or Entity), you have to define a getter for the attribute #{{attributeName}}.
        You can define a native getter (get {{attributeName}}) or a custom getter ({{customGetterName}}).
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
        const className = node?.id?.name ?? ''
        const allowedWords = ['VO', 'ValueObject', 'Entity']
        const isDomainModelName = allowedWords.some(allowWord => className.includes(allowWord))

        if (!isDomainModelName && !isValueObjectPath) return
        if (!isDomainModelName && !isEntityPath) return

        // Check if all attributes are public
        const publicAttributes = node.body.body.filter(node => {
          return node.type === 'PropertyDefinition' && node.key.type === 'Identifier' && node.value?.type !== 'ArrowFunctionExpression'
        })

        publicAttributes.forEach(attribute => {
          context.report({
            node: attribute,
            messageId: 'attributeHasToBePrivate'
          })
        })

        // Check if a private attribute has a public accessor
        const privateAttributes = node.body.body.filter(node => {
          return node.type === 'PropertyDefinition' && node.key.type === 'PrivateIdentifier'
        })
        const classMethods = node.body.body.filter(node => {
          return node.type === 'MethodDefinition' || node.value?.type === 'ArrowFunctionExpression'
        })

        privateAttributes.forEach(attribute => {
          let hasGetter = false
          const customGetterName = `get${attribute.key.name.charAt(0).toUpperCase()}${attribute.key.name.slice(1)}`

          classMethods.forEach(method => {
            const existNativeGetterWithAttributeKey = method.key.name === attribute.key.name && method.kind === 'get'
            const existCustomGetterWithAttributeKey = method.key.name === customGetterName

            if (existNativeGetterWithAttributeKey || existCustomGetterWithAttributeKey) {
              hasGetter = true
            }
          })

          if (!hasGetter) {
            context.report({
              node: attribute,
              messageId: 'privateAttributeHasToHaveGetter',
              data: {
                attributeName: attribute.key.name,
                customGetterName
              }
            })
          }
        })
      }
    }
  }
}
