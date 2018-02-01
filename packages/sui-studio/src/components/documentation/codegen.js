const pwd = process.env.PWD
const walker = require('../../../bin/walker')
const components = walker.componentsName(pwd)

const requires = components
  .map(component => `
  requires['${component}'] = {
    changelog: function (resolve) {
      require.ensure([], function (require) {
        resolve(require('bundle-loader?lazy!raw-loader!${pwd}/components/${component}/CHANGELOG.md'))
      }, '${component}')
    },
    readme: function (resolve) {
      require.ensure([], function (require) {
        resolve(require('bundle-loader?lazy!raw-loader!${pwd}/components/${component}/README.md'))
      }, '${component}')
    },
    src: function (resolve) {
      require.ensure([], function (require) {
        resolve(require('!!bundle-loader?lazy!raw-loader!${pwd}/components/${component}/src/index.js'))
      }, '${component}')
    },
  }
`)
  .join('')

module.exports = `
var requires = {};
${requires}
console.log(requires)
`
