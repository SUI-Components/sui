/* global __BASE_DIR__ */

import {safeImport} from './utils.js'

export const importGlobals = () => {
  // we use a variable for the file so Webpack
  // could safe fail if the file doesn't exist
  const globalsFile = 'globals.js'
  return safeImport({
    importFile: () =>
      import(
        /* webpackInclude: /\/components\/globals.js$/ */
        `${__BASE_DIR__}/components/${globalsFile}`
      )
  })
}
