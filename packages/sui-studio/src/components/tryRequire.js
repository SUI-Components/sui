/* global __BASE_DIR__ */

const safeImport = async ({
  defaultValue = false,
  extractDefault = true,
  importFile
}) => {
  const file = await importFile().catch(_ => defaultValue)
  if (typeof file === 'undefined') {
    return Promise.reject(new Error('Error requiring file'))
  }
  return extractDefault && typeof file === 'object' ? file.default : file
}

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

export const fetchMarkdownFile = ({category, component, file}) =>
  fetchStaticFile(`/components/${category}/${component}/${file}.md`)

export const fetchPlayground = ({category, component}) =>
  fetchStaticFile(`/demo/${category}/${component}/playground`)

export const importContexts = ({category, component}) =>
  safeImport({
    defaultValue: false,
    importFile: () =>
      import(`${__BASE_DIR__}/demo/${category}/${component}/context.js`)
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
        /* webpackExclude: /\/node_modules\/(.*)\/src\/index.js$/ */
        `${__BASE_DIR__}/components/${category}/${component}/src/index.js`
      )
  })

const importDemo = ({category, component}) =>
  safeImport({
    importFile: () =>
      import(
        /* webpackExclude: /\/node_modules\/(.*)\/demo\/index.js$/ */
        `${__BASE_DIR__}/demo/${category}/${component}/demo/index.js`
      )
  })

const importEvents = ({category, component}) =>
  safeImport({
    importFile: () =>
      import(`${__BASE_DIR__}/demo/${category}/${component}/events.js`)
  })

export const importMainModules = params =>
  Promise.all([
    importReactComponent(params),
    importContexts(params),
    importEvents(params),
    importDemo(params)
  ])
