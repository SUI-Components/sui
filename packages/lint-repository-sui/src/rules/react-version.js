const dedent = require('string-dedent')

const REACT_VERSION = '18'

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Check that your repository use the latest React version',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      badReactVersion: dedent`
        Please be sure that your repository use the latest React Version ${REACT_VERSION}.
        Your current version is {{version}}.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      missingReactDependencie: dedent`
        Your project doesnt have installed React.
        Please install at least the version ${REACT_VERSION}.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      missingPackageLock: dedent`
        To calculate the react version first we need to have a package-lock.json in the root
        If you are not sure about how do it, please contact with Platform Web.
      `
    }
  },
  create: function (context) {
    return {
      'package-lock.json': matches => {
        const [packageLock] = matches
        let version = packageLock?.parsed?.packages?.['node_modules/react']?.version

        if (!version) {
          context.report({
            messageId: 'missingReactDependencie'
          })
          return context.monitoring(0)
        }

        version = version.split('.')[0]

        if (version !== REACT_VERSION) {
          context.report({
            messageId: 'badReactVersion',
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
