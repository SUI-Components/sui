const dedent = require('string-dedent')

const handler = (context, matches) => {
  const badComponents = matches
    .filter(match => match.path.match(/src\/pages\/.*/))
    .filter(match => !match.path.match(/src\/pages\/\w+\/index\.(j|t)s(x)?/))
    .filter(match => match.raw.match(/(?<tag><\w+\s*.*>)|(?<fragment><>)|(?<react>react)/)).length

  context.report({
    messageId: 'number',
    data: {number: badComponents}
  })
  return context.monitoring(badComponents)
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'This metric reports how many component live outside of our Studios.',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      number: dedent`
       Currently, your project has {{number}} component living outside of your SUI-Studio.
       Try to move all those component to your \`packages/ui/components\` folder.
      `
    }
  },
  create: function (context) {
    return {
      'app/src/pages/**/*.(j|t)s(x)?': handler.bind(undefined, context),
      'src/**/*.(j|t)s(x)?': handler.bind(undefined, context)
    }
  }
}
