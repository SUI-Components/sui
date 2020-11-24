/* global __BASE_DIR__ */

import {safeImport} from './utils'

export const importGlobals = () => {
  // we use a variable for the file so Webpack
  // could safe fail if the file doesn't exist
  const globalsFile = 'globals.js'
  return safeImport({
    importFile: () =>
      import(
        /* webpackInclude: /\/demo\/globals.js$/ */
        `${__BASE_DIR__}/demo/${globalsFile}`
      )
  })
}
