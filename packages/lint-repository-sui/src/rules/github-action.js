const dedent = require('string-dedent')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Check that your repository have properly setup the GHA to CI/CD',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingGithubFolder: dedent`
        Every project needs to have a .github/worflows folder to be able to run CI/CD in GHA.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      missingMainWorkflow: dedent`
        Every project needs to have a workflow to run on master.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      missingPRWorkflow: dedent`
        Every project needs to have a workflow to run on every PR.
        If you are not sure about how do it, please contact with Platform Web.
      `
    }
  },
  reduceMonitoring: function (monitorings) {
    return monitorings.reduce((acc, signal) => {
      return acc && signal.value
    }, true)
  },
  create: function (context) {
    return {
      '.github/workflows': matches => {
        context.monitoring(true)
      },

      '.github/**/main.yml': matches => {
        context.monitoring(true)
      },

      '.github/**/pullrequest.yml': matches => {
        context.monitoring(true)
      },

      missmatch: key => {
        if (key === '.github/workflows') {
          context.report({
            messageId: 'missingGithubFolder'
          })
          context.monitoring(false, '.github/workflows')
        }

        if (key === '.github/**/main.yml') {
          context.report({
            messageId: 'missingMainWorkflow'
          })
          context.monitoring(false, '.github/**/main.yml')
        }

        if (key === '.github/**/pullrequest.yml') {
          context.report({
            messageId: 'missingPRWorkflow'
          })
          context.monitoring(false, '.github/**/pullrequest.yml')
        }
      }
    }
  }
}
