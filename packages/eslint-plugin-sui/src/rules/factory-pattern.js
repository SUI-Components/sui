/**
 * @fileoverview Ensure that our classes are using the convetion of has a static create method as factory.
 * @author factory pattern
 */
'use strict'

const dedent = require('string-dedent')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'warning',
    docs: {
      description: 'ensure to define at least one factory function',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      notFoundExportedFactoryNamedDeclaration: dedent`
      You have to define a constant named 'factory' that returns the create method.
      `,
      notFoundFactoryFunction: dedent`
      You have to define at least one static method that returns an instance of your class.
      Avoid to use the 'new' keyword directly in your code. 
      Use always a factory function
      `
    }
  },
  create: function (context) {
    // variables should be defined here
    const ENTITY_SUPER_CLASS = 'Entity'
    const ERROR_SUPER_CLASS = 'Error'
    const MAPPER_SUPER_CLASS = 'Mapper'
    const REPOSITORY_SUPER_CLASS = 'Repository'
    const SERVICE_SUPER_CLASS = 'Service'
    const USE_CASE_SUPER_CLASS = 'UseCase'
    const VALUE_OBJECT_SUPER_CLASS = 'ValueObject'

    const SUPER_CLASS_TYPES = {
      ENTITY: ENTITY_SUPER_CLASS,
      ERROR: ERROR_SUPER_CLASS,
      MAPPER: MAPPER_SUPER_CLASS,
      REPOSITORY: REPOSITORY_SUPER_CLASS,
      SERVICE: SERVICE_SUPER_CLASS,
      USE_CASE: USE_CASE_SUPER_CLASS,
      VALUE_OBJECT: VALUE_OBJECT_SUPER_CLASS
    }

    const SUPER_CLASS_TYPES_WITH_CUSTOM_CREATE_METHOD = [SUPER_CLASS_TYPES.ENTITY, SUPER_CLASS_TYPES.VALUE_OBJECT]

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return {
      ClassDeclaration(node) {
        if (!SUPER_CLASS_TYPES_WITH_CUSTOM_CREATE_METHOD.includes(node?.superClass?.name)) {
          const createMethod = node?.body?.body?.find(
            body => body?.type === 'MethodDefinition' && body?.static && body?.key?.name === 'create'
          )

          if (!createMethod) {
            context.report({
              node: node?.id ?? node?.superClass ?? node,
              messageId: 'notFoundFactoryFunction'
            })
          }

          if (createMethod) {
            const hasReturnStatement = Boolean(
              createMethod?.value?.body?.body?.find(
                body => body?.type === 'ReturnStatement' && body?.argument?.type === 'NewExpression'
              )
            )

            if (!hasReturnStatement) {
              context.report({
                node: node?.id ?? node?.superClass ?? node,
                messageId: 'notFoundFactoryFunction'
              })
            }
          }
        }

        const isUseCase = node?.superClass?.name === USE_CASE_SUPER_CLASS

        if (isUseCase) {
          const hasExportedFactoryVariable = Boolean(
            node.parent.body.find(
              body =>
                body?.type === 'ExportNamedDeclaration' &&
                body?.declaration?.type === 'VariableDeclaration' &&
                body?.declaration?.declarations?.[0]?.id?.name === 'factory'
            )
          )

          if (!hasExportedFactoryVariable) {
            context.report({
              node: node?.id ?? node?.superClass ?? node,
              messageId: 'notFoundExportedFactoryNamedDeclaration'
            })
          }
        }
      }
    }
  }
}
