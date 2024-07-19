/**
 * @fileoverview ensure domain model have a private attributes and each attribute has a getter
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
      description: 'Ensure domain models have all attributes as private and each attribute has a getter',
      recommended: false,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      attributeHasToBePrivate: dedent`
        If your class is a domain model (Value Object or Entity), you have to define all attributes as private.
      `,
      privateAttributeHasToHaveGetter: dedent`
        If your class is a domain model (Value Object or Entity), you have to define a getter for the attribute #{{attributeName}}.
        You can define a native getter (get {{attributeName}}) or a custom getter ({{customGetterName}}).
      `
    }
  },

  create(context) {
    return {
      ClassDeclaration(node) {
        const className = node?.id?.name ?? ''

        const allowedWords = ['VO', 'ValueObject', 'Entity']

        const isDomainModel = allowedWords.some(allowWord => className.includes(allowWord))

        if (!isDomainModel) return // eslint-disable-line

        // Check if all attributes are public
        const publicAttributes = node.body.body.filter(node => {
          return node.type === 'PropertyDefinition' && node.key.type === 'Identifier'
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
        const classMethods = node.body.body.filter(node => node.type === 'MethodDefinition')

        privateAttributes.forEach(attribute => {
          let hasGetter = false
          const customGetterName = `get${attribute.key.name.charAt(0).toUpperCase()}${attribute.key.name.slice(1)}`

          classMethods.forEach(method => {
            const existNativeGetterWithAttributeKey = method.key.name === attribute.key.name && method.kind === 'get'
            const existCustomGetterWithAttributeKey = method.key.name === customGetterName

            if (existNativeGetterWithAttributeKey | existCustomGetterWithAttributeKey) {
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
