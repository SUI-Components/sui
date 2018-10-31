const program = require('commander')
const path = require('path')
const config = require('@s-ui/bundler/webpack.config.dev')
const startDevServer = require('@s-ui/bundler/bin/sui-bundler-dev')

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Shows a demo of your SVG library')
    console.log('')
  })
  .parse(process.argv)

const studioDevConfig = {
  ...config,
  context: path.resolve(__dirname, '../src'),
  module: {
    ...config.module,
    rules: [...config.module.rules.slice(1)]
  }
}

console.log(studioDevConfig.module.rules)

startDevServer({
  config: studioDevConfig
})
