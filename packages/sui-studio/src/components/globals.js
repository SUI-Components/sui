/* global __BASE_DIR__ */

import {safeImport} from './utils.js'

export const importGlobals = () => {
  return safeImport({
    importFile: () =>
      import(
        /* webpackInclude: /\/components\/globals.js$/ */
        `${__BASE_DIR__}/components/globals.js`
      )
  })
}
