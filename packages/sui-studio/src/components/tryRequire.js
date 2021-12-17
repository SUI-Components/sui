/* global __BASE_DIR__ */

import {safeImport} from './utils'

const fetchStaticFile = path =>
  window
    .fetch(path)
    .then(res => res.text())
    // As we're working within a SPA, 404 routes return the index.html.
    // So, we concatenate another `then` to check if we hit the
    // index.html starting with <!DOCTYPE, to return false
    .then(text => (text.startsWith('<!') ? false : text))

export const fetchComponentSrcRawFile = ({category, component}) =>
  fetchStaticFile(`/components/${category}/${component}/src/index.js`)

export const fetchComponentsReadme = () =>
  fetchStaticFile(`/components/README.md`)

export const fetchMarkdownFile = ({category, component, file}) =>
  fetchStaticFile(`/components/${category}/${component}/${file}.md`)

export const fetchPlayground = ({category, component}) =>
  fetchStaticFile(`/components/${category}/${component}/demo/playground`)

export const importContexts = ({category, component}) =>
  safeImport({
    defaultValue: false,
    importFile: () =>
      import(
        /* webpackChunkName: "context-[request]" */
        `${__BASE_DIR__}/components/${category}/${component}/demo/context.js`
      )
  })

export const importReactComponent = ({
  category,
  component,
  extractDefault = false
}) =>
  safeImport({
    extractDefault,
    importFile: () =>
      import(
        /* webpackChunkName: "src-[request]" */
        /* webpackExclude: /\/node_modules\/(.*)\/src\/index.js$/ */
        `${__BASE_DIR__}/components/${category}/${component}/src/index.js`
      )
  })

const importDemo = ({category, component}) =>
  safeImport({
    importFile: () =>
      import(
        /* webpackChunkName: "demo-[request]" */
        /* webpackExclude: /\/node_modules\/(.*)\/demo\/index.js$/ */
        `${__BASE_DIR__}/components/${category}/${component}/demo/index.js`
      )
  })

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

export const importMainModules = params =>
  Promise.all([
    importReactComponent(params),
    importContexts(params),
    importDemo(params)
  ])
