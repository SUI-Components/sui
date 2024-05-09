const dedent = require('string-dedent')

const SUI_TOOLS_PACKAGES = [
  '@s-ui/react-context',
  '@s-ui/react-form-builder',
  '@s-ui/react-hooks',
  '@s-ui/react-router',
  '@s-ui/react-head'
]

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'This metric reports the number of spark component we use over sui-components',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      percentage: dedent`
        Currently, your project utilizes {{percentage}}% of Spark UI components out of all SUI and Spark UI components in your project. We should aim to remove as many SUI components as possible.
      `
    }
  },

  create: function (context) {
    return {
      '**/*.(j|t)s(x)?': matches => {
        const totalSUIComponents = matches
          .filter(match => match.raw.match(/'@s-ui\/react-.*'/))
          .map(file => file.raw.split(/\n+/))
          .flat(Infinity)
          .filter(line => line.match(/'@s-ui\/react-.*'/))
          .filter(line => !SUI_TOOLS_PACKAGES.some(pkg => line.includes(pkg))).length

        const totalSparkComponents = matches
          .filter(match => match.raw.match(/'@spark-ui\/.*'/))
          .map(file => file.raw.split(/\n+/))
          .flat(Infinity)
          .filter(line => line.match(/'@spark-ui\/.*'/)).length

        let percentage = (totalSparkComponents * 100) / (totalSparkComponents + totalSUIComponents)
        percentage = Math.round((percentage + Number.EPSILON) * 100) / 100

        context.report({
          messageId: 'percentage',
          data: {percentage}
        })
        return context.monitoring(percentage)
      },

      missmatch: key => {
        context.report({
          messageId: 'percentage',
          data: {percentage: 0}
        })
        context.monitoring(0)
      }
    }
  }
}
