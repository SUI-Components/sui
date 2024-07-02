/**
 * @fileoverview Ensure the right usage of @inlineError decorator from sui in sui-domain
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
    type: 'problem',
    docs: {
      description: 'Ensure the right usage of @inlineError decorator from sui in sui-domain',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: 'code',
    schema: [],
    messages: {
      avoidUseInlineErrorOnAsyncFunctions: dedent`
        The @inlineError decorator is deprecated on async functions. Use the @AsyncInlineError() decorator instead.
        `,
      useInlineErrorOnNonAsyncFunctions: dedent`
        The @inlineError decorator should be used on non async functions.
        `
    }
  },
  create: function (context) {
    const asyncInlineErrorImportStatement = "import {AsyncInlineError} from '@s-ui/decorators';\n"

    const filePath = context.getFilename()
    const relativePath = path.relative(context.getCwd(), filePath)

    // Check if the file is inside requierd folders (useCases, services, repositories, ...)
    const useCasePattern = /useCases|usecases/i
    const isUseCasePath = useCasePattern.test(relativePath)

    const servicePattern = /services/i
    const isServicePath = servicePattern.test(relativePath)

    const repositoryPattern = /repositories/i
    const isRepositoryPath = repositoryPattern.test(relativePath)

    return {
      MethodDefinition(node) {
        // Method
        const method = node
        const isAsync = method?.value?.async || false
        const methodName = method.key?.name
        const isExecuteMethod = methodName === 'execute'

        // Class
        const classObject = node.parent?.parent
        const className = classObject?.id?.name
        const superClassName = classObject?.superClass?.name

        // UseCase
        const containUseCase = className?.endsWith('UseCase')
        const extendsUseCase = superClassName === 'UseCase'
        const isUsecase = containUseCase || extendsUseCase || isUseCasePath

        // Service
        const containService = className?.endsWith('Service')
        const extendsService = superClassName === 'Service'
        const isService = containService || extendsService || isServicePath

        // Repository
        const containRepository = className?.endsWith('Repository')
        const extendsRepository = superClassName === 'Repository'
        const isRepository = containRepository || extendsRepository || isRepositoryPath

        // Skip if it's not a UseCase, Service or Repository
        if (!isUsecase && !isService && !isRepository && !isExecuteMethod) return

        // Skip if a constructor or a not public method (starts by _ or #)
        if (methodName === 'constructor') return
        if (methodName.startsWith('_')) return
        if (methodName.startsWith('#')) return
        if ((isUsecase || isService) && !isExecuteMethod) return

        // Method decorators
        const methodDecorators = method.decorators
        const hasDecorators = methodDecorators?.length > 0

        // Get the @inlineError decorator from method
        const inlineErrorDecoratorNode =
          hasDecorators && methodDecorators?.find(decorator => decorator?.expression?.name === 'inlineError')

        // TODO: Pending to check if a function is returning a promise (not using async/await syntax)
        if (inlineErrorDecoratorNode && isAsync) {
          context.report({
            node: inlineErrorDecoratorNode,
            messageId: 'avoidUseInlineErrorOnAsyncFunctions',
            *fix(fixer) {
              yield fixer.remove(inlineErrorDecoratorNode)
              yield fixer.insertTextAfter(methodDecorators.at(-1), '\n@AsyncInlineError()')
              yield fixer.insertTextBeforeRange([0, 0], asyncInlineErrorImportStatement)
            }
          })
        }

        if (!isAsync && !inlineErrorDecoratorNode) {
          context.report({
            node: method.key,
            messageId: 'useInlineErrorOnNonAsyncFunctions'
          })
        }
      }
    }
  }
}
