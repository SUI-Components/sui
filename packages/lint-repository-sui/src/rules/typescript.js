const dedent = require('string-dedent')

const MIN_TYPESCRIPT_VERSION = 5

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Check that your repository has a `tsconfig.json` file',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingTypescriptDependency: dedent`
        Your project doesn't have installed TypeScript.
        Please install at least the version ${MIN_TYPESCRIPT_VERSION}.
      `,
      badTypescriptVersion: dedent`
        Please be sure that your repository use the latest TypeScript version ${MIN_TYPESCRIPT_VERSION}.
        Your current version is {{version}}.
      `,
      noTSConfigFile: dedent`
        Every project must have a \`tsconfig.json\` file to setup TypeScript in the project.
      `
    }
  },
  create: function (context) {
    return {
      'tsconfig.json': () => {
        // TO-DO: Check TypeScript configuration is the one we expect.

        return context.monitoring(true)
      },
      'package-lock.json': matches => {
        const [packageLock] = matches
        let version = packageLock?.parsed?.packages?.['node_modules/typescript']?.version

        // Check if repository is defining TS as dependency.
        if (!version) {
          context.report({
            messageId: 'missingTypescriptDependency'
          })

          return context.monitoring(false)
        }

        version = version.split('.')[0]

        // Check if repository is using minimum expected version.
        if (Number.parseInt(version) < MIN_TYPESCRIPT_VERSION) {
          context.report({
            messageId: 'badTypescriptVersion',
            data: {version}
          })

          return context.monitoring(false)
        }

        return context.monitoring(true)
      },
      missmatch: () => {
        context.report({
          messageId: 'noTSConfigFile'
        })

        return context.monitoring(false)
      }
    }
  },
  reduceMonitoring: function (monitorings) {
    return monitorings.reduce((acc, signal) => {
      return acc && signal.value
    }, true)
  }
}
