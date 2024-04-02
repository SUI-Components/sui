const dedent = require('string-dedent')

const SUI_TOOLS_VERSIONS = {
  bundler: '9',
  lint: '4',
  studio: '11',
  ssr: '8',
  mono: '2',
  'test-e2e': '1',
  pde: '2',
  test: '8',
  theme: '8',
  domain: '2'
}

module.exports = {
  SUI_TOOLS_VERSIONS,
  meta: {
    type: 'problem',
    docs: {
      description: 'Check that your repository use the latest SUI Tools version',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      badVersion: dedent`
        Please be sure that your repository use the latest {{name}}. Version {{spectedVersion}}.
        Your current version is {{version}}.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      missingDependencie: dedent`
        Your project doesnt have installed {{name}}.
        Please install at least the version {{spectedVersion}}.
        If you are not sure about how do it, please contact with Platform Web.
      `,
      missingPackageLock: dedent`
        To calculate the SUI Tool version first we need to have a package-lock.json in the root
        If you are not sure about how do it, please contact with Platform Web.
      `
    }
  },
  create: function (context) {
    return {
      'package-lock.json': matches => {
        const [packageLock] = matches

        Object.entries(SUI_TOOLS_VERSIONS).forEach(([name, spectedVersion]) => {
          let version = packageLock?.parsed?.packages?.[`node_modules/@s-ui/${name}`]?.version

          if (!version) {
            context.report({
              messageId: 'missingDependencie',
              data: {name, spectedVersion}
            })
            return context.monitoring(false)
          }

          version = version.split('.')[0]

          if (version !== spectedVersion) {
            context.report({
              messageId: 'badVersion',
              data: {name, version, spectedVersion}
            })
            return context.monitoring(false)
          }
          return context.monitoring(true)
        })
      },

      missmatch: () => {
        context.report({
          messageId: 'missingPackageLock'
        })
        context.monitoring(0)
      }
    }
  },
  reduceMonitoring: function (monitorings) {
    return monitorings.reduce((acc, signal) => {
      return acc && signal.value
    }, true)
  }
}
