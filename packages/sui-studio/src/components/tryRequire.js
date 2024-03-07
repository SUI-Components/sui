/* global __BASE_DIR__ */

import {safeImport} from './utils.js'

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

export const fetchComponentsDefinitions = ({category, component}) =>
  window.fetch(`/components/${category}/${component}/src/definitions.json`).then(res => res.json())

export const fetchComponentsReadme = () => fetchStaticFile(`/components/README.md`)

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

export const importReactComponent = ({category, component, subComponentName = null, extractDefault = false}) => {
  if (typeof subComponentName === 'string') {
    return safeImport({
      extractDefault,
      importFile: () => {
        return import(
          /* webpackChunkName: "src-component-[request]" */
          /* webpackExclude: /\/node_modules\/(.*)\/src\/(.*)$/ */
          `${__BASE_DIR__}/components/${category}/${component}/src/${subComponentName}/index.js`
        )
      }
    })
  }

  return safeImport({
    extractDefault,
    importFile: () => {
      return import(
        /* webpackChunkName: "src-[request]" */
        /* webpackExclude: /\/node_modules\/(.*)\/src\/index$/ */
        `${__BASE_DIR__}/components/${category}/${component}/src/index`
      )
    }
  })
}

const importDemo = ({category, component}) =>
  safeImport({
    importFile: () =>
      import(
        /* webpackChunkName: "demo-[request]" */
        /* webpackExclude: /\/node_modules\/(.*)\/demo\/index$/ */
        `${__BASE_DIR__}/components/${category}/${component}/demo/index`
      )
  })

export const importGlobals = () => {
  // we use a variable for the file so Webpack
  // could safe fail if the file doesn't exist
  // const globalsFile = 'globals.js'
  return safeImport({
    importFile: () =>
      import(
        /* webpackInclude: /\/components\/globals.js$/ */
        /* webpackExclude: /(.*)\.md$/ */
        `${__BASE_DIR__}/components/globals.js`
      )
  })
}

export const importMainModules = params =>
  Promise.all([importReactComponent(params), importContexts(params), importDemo(params)])
