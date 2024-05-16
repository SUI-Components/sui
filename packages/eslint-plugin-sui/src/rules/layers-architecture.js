/**
 * @fileoverview  Make sure to avoid direct file imports from other packages within your monorepo.
 * */
'use strict'

const dedent = require('string-dedent')
const {Monorepo} = require('../utils/monorepo.js')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Make sure to avoid direct file imports from other packages within your monorepo',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      forbiddenRelativeImports: dedent`
        When using a package from your monorepo, import it directly instead of using a relative path.
      `
    }
  },
  create: function (context) {
    const monorepo = Monorepo.create(context.cwd)

    return {
      ImportDeclaration(node) {
        const isForbidden = monorepo.isPackage(context.filename, node.source.value)

        isForbidden &&
          context.report({
            node,
            messageId: 'forbiddenRelativeImports'
          })
      }
    }
  }
}
