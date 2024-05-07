const dedent = require('string-dedent')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Check that your repository have created a package-lock file',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingPackageLock: dedent`
        Every project needs to have a package-lock.json file to be used in CI/CD.
      `
    }
  },
  create: function (context) {
    return {
      'package-lock.json': matches => {
        context.monitoring(true)
      },

      missmatch: key => {
        context.report({
          messageId: 'missingPackageLock'
        })
        context.monitoring(false)
      }
    }
  }
}
