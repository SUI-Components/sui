const dedent = require('string-dedent')

const NODE_VERSION = '20'

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Check that your repository use the latest Node version',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      moreThanOneNVMRC: dedent`
        Your project has more than one .nvmrc file. That can be dangerous.
        Please, use onle ONE in the root of your project.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      badNodeVersion: dedent`
        Your current Node version is {{version}}.
        Please be sure that your repository use the latest Node Version ${NODE_VERSION}.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      noNMVRCFile: dedent`
        Every project have to have a .npmrc file to define the node versión.
        If you are not sure about how do it, please contact with Platform Web.
      `
    }
  },
  create: function (context) {
    return {
      '.nvmrc': matches => {
        if (matches.length > 1) {
          context.report({
            messageId: 'moreThanOneNVMRC'
          })
          return context.monitoring(0)
        }

        const [nvmrcMatch] = matches
        const [version] = nvmrcMatch.raw.trim().split('.')
        if (version !== NODE_VERSION) {
          context.report({
            messageId: 'badNodeVersion',
            data: {version}
          })
        }

        context.monitoring(version)
      },

      missmatch: key => {
        context.report({
          messageId: 'noNMVRCFile'
        })
        context.monitoring(0)
      }
    }
  }
}
