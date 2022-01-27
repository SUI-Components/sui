const copy = require('./copy.js')

const DESTINATION_FOLDER = 'public'

module.exports = function copyStaticFiles() {
  console.log('[sui-studio] Copying static files...')
  console.time('[sui-studio] Copying static files took')
  return copy(
    [
      'components/README.md',
      'components/*/*/README.md',
      'components/*/*/CHANGELOG.md',
      'components/*/*/UXDEF.md',
      'components/*/*/src/index.js',
      'components/*/*/demo/playground',
      DESTINATION_FOLDER
    ],
    {
      exclude: 'node_modules/**'
    }
  ).then(() => {
    console.timeEnd('[sui-studio] Copying static files took')
  })
}
