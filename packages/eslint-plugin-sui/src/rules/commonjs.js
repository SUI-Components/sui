/**
 * @fileoverview Ensure your code is not using CommonJS signatures like module.exports or moduel.exports.foo or require() or require.resolve()
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
      description: 'Ensure that your code is using ems over commonjs modules',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      forbiddenExports: dedent`
        Use module.* should be avoid.
      `,
      forbiddenRequires: dedent`
        Use require function should be avoid.
      `,
      forbiddenModuleRequire: dedent`
        Use module.require function should be avoid.
      `,
      forbiddenRequiresObjects: dedent`
        Use require.cache or require.extensions or require.main should be avoid.
      `,
      forbiddenRequireResolve: dedent`
        Use require.resolve function should be avoid.
      `,
      forbidden__filename: dedent`
        __filename should be avoid
      `,
      forbidden__dirname: dedent`
        __dirname should be avoid
      `
    }
  },
  create: function (context) {
    return {
      CallExpression(node) {
        const isRequire = node.callee?.name === 'require'
        const isResolve = node.callee?.object?.name === 'require' && node.callee?.property?.name === 'resolve'
        const isModule = node.callee?.object?.name === 'module' && node.callee?.property?.name === 'require'

        isRequire &&
          context.report({
            node,
            messageId: 'forbiddenRequires'
          })

        isResolve &&
          context.report({
            node,
            messageId: 'forbiddenRequireResolve'
          })

        isModule &&
          context.report({
            node,
            messageId: 'forbiddenModuleRequire'
          })
      },
      MemberExpression(node) {
        const isModule =
          node.object?.name === 'module' &&
          ['children', 'exports', 'filename', 'id', 'isPreloading', 'loaded', 'parent', 'path', 'paths'].some(
            property => node.property?.name === property
          )

        const isRequire =
          node.object?.name === 'require' &&
          ['cache', 'extensions', 'main'].some(property => node.property?.name === property)

        isModule &&
          context.report({
            node,
            messageId: 'forbiddenExports'
          })

        isRequire &&
          context.report({
            node,
            messageId: 'forbiddenRequiresObjects'
          })
      },
      Identifier(node) {
        node.name === '__filename' &&
          context.report({
            node,
            messageId: 'forbidden__filename'
          })

        node.name === '__dirname' &&
          context.report({
            node,
            messageId: 'forbidden__dirname'
          })
      }
    }
  }
}
