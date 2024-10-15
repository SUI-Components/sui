const dedent = require('string-dedent')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'This metric reports the number component that use Jest',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      percentage: dedent`
        Currently, {{percentage}}% of your components use Jest. We have {{totalKarmaTests}}% tests in Karma and {{totalJestTests}}% in Jest
      `
    }
  },

  create: function (context) {
    return {
      'components/**/(test|__tests__)/*.(j|t)s(x)?': matches => {
        const totalTests = matches.length
        const totalJestTests = matches.filter(({fullPath}) => fullPath.includes('__tests__')).length
        const totalKarmaTests = totalTests - totalJestTests
        let percentage = (totalJestTests * 100) / totalTests
        percentage = Math.round((percentage + Number.EPSILON) * 100) / 100

        context.report({
          messageId: 'percentage',
          data: {percentage, totalKarmaTests, totalJestTests}
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
