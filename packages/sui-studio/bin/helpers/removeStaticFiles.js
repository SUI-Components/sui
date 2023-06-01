const remove = require('./remove.js')

const DESTINATION_FOLDER = 'public'

module.exports = function removeStaticFiles() {
  console.log('[sui-studio] Removing unnecessary static files...')
  console.time('[sui-studio] Removing static files took')

  return remove(['components/*/*/src/**/*.js', DESTINATION_FOLDER], {
    exclude: 'node_modules/**'
  }).then(() => {
    console.timeEnd('[sui-studio] Removing static files took')
  })
}
