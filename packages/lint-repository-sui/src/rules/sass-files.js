const dedent = require('string-dedent')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'This metric reports the number of sass files in your repository',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      percentage: dedent`
       Currently, your project has {{number}} sass files.
       We should remove as many sass files as we can
      `
    }
  },
  create: function (context) {
    return {
      '**/*.scss': matches => {
        context.report({
          messageId: 'percentage',
          data: {number: matches.length}
        })
        return context.monitoring(matches.length)
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
