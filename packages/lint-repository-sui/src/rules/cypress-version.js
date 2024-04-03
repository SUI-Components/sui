const dedent = require('string-dedent')

const CYPRESS_VERSION = '10'

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Check that your repository use the latest Cypress version',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      badCypressVersion: dedent`
        Please be sure that your repository use the latest Cypress Version ${CYPRESS_VERSION}.
        Your current version is {{version}}.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      missingCypressDependencie: dedent`
        Your project doesnt have installed Cypress.
        Please install at least the version ${CYPRESS_VERSION}.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      missingPackageLock: dedent`
        To calculate the cypress version first we need to have a package-lock.json in the root
        If you are not sure about how do it, please contact with Platform Web.
      `
    }
  },
  create: function (context) {
    return {
      'package-lock.json': matches => {
        const [packageLock] = matches
        let version = packageLock?.parsed?.packages?.['node_modules/cypress']?.version

        if (!version) {
          context.report({
            messageId: 'missingCypressDependencie'
          })
          return context.monitoring(0)
        }

        version = version.split('.')[0]

        if (version !== CYPRESS_VERSION) {
          context.report({
            messageId: 'badCypressVersion',
            data: {version}
          })
        }
        return context.monitoring(version)
      },

      missmatch: key => {
        context.report({
          messageId: 'missingPackageLock'
        })
        context.monitoring(0)
      }
    }
  }
}
