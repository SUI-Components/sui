const dedent = require('string-dedent')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'This metric reports the percentage of TypeScript files in the repository relative to all files.',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      percentage: dedent`
       Currently, your project has migrated {{percentage}}% of files from JSX? to TSX?.
      `
    }
  },
  create: function (context) {
    return {
      '**/*.(j|t)s(x)?': matches => {
        const tsFile = matches.filter(match => match.fullPath.match(/.*\.tsx?/)).length
        let percentage = (tsFile * 100) / matches.length
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
