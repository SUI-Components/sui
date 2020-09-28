const cpy = require('cpy')

module.exports = function copyStaticFiles() {
  return cpy(
    [
      'components/**/README.md',
      'components/**/CHANGELOG.md',
      'components/**/UXDEF.md',
      'components/**/src/index.js',
      'demo/**/playground'
    ],
    'public',
    {
      deep: 3,
      parents: true
    }
  )
}
