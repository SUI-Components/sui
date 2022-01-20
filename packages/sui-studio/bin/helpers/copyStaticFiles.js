const copy = require('./copy.js')

const DESTINATION_FOLDER = 'public'

module.exports = function copyStaticFiles() {
  return copy(
    [
      'components/**/README.md',
      'components/**/CHANGELOG.md',
      'components/**/UXDEF.md',
      'components/**/src/index.js',
      'components/**/demo/playground',
      DESTINATION_FOLDER
    ],
    {
      exclude: 'node_modules/**'
    }
  ).then(() => {
    console.log('[sui-studio] Static files copied')
  })
}
