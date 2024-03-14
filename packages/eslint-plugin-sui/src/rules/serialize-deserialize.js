/**
 * @fileoverview ensure entity create - toJSON
 * @creator david.lacedonia@adevinta.com
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
      description: 'ensure entity create - toJSON',
      recommended: false,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      toJSONProperties: 'Missing toJSON properties ({{props}})',
      invalidTOJSONProperties: 'toJSON should return an object',
      missingToJSONMethod: dedent`
      If your class has a 'static create' method. You have to define a 'toJSON' method too.
      The output of the 'toJSON' should be the same as the input of your 'static create' method
      `,
      missingCreateMethod: dedent`
      If your class has a 'toJSON' method. You have to define a 'static create' method too.
      The output of the 'toJSON' should be the same as the input of your 'static create' method
      `,
      forbiddenSpreadElements: dedent`
      Spread operation are not allowed as part of the toJSON function.
      The output of the 'toJSON' should be the same as the input of your 'static create' method
      `
    }
  },

  create(context) {
    return {
      ClassDeclaration(node) {
        const create = node.body.body.find(i => i.key.name === 'create')
        const toJSON = node.body.body.find(i => i.key.name === 'toJSON')
        const className = node?.id?.name ?? ''

        if (['UseCase', 'Service', 'Repository'].some(allowWord => className.includes(allowWord))) return // eslint-disable-line

        if (!create && !toJSON) return

        if (create && !toJSON)
          return context.report({
            node: create.key,
            messageId: 'missingToJSONMethod'
          })

        if (toJSON && !create)
          return context.report({
            node: toJSON.key,
            messageId: 'missingCreateMethod'
          })

        let createParams = create.value.params[0] || {properties: []}
        if (createParams.left) {
          createParams = createParams.left
        }

        const createProperties = createParams.properties
        const toJSONProperties = toJSON.value.body.body?.find(node => node.type === 'ReturnStatement')?.argument
          ?.properties

        const spreadElement = toJSONProperties?.find(node => node.type === 'SpreadElement')
        if (spreadElement) {
          return context.report({
            node: spreadElement,
            messageId: 'forbiddenSpreadElements'
          })
        }

        if (!toJSONProperties) {
          return context.report({
            node: toJSON.key,
            messageId: 'invalidTOJSONProperties'
          })
        }

        const createProps = createProperties.map(i => i.key.name)
        const toJSONProps = toJSONProperties.map(i => i.key.name)

        const missingToJSONProps = createProps.filter(p => !toJSONProps.find(e => e === p))
        if (missingToJSONProps.length) {
          context.report({
            node: toJSON.key,
            messageId: 'toJSONProperties',
            data: {
              props: missingToJSONProps.join(', ')
            }
          })
        }
      }
    }
  }
}
