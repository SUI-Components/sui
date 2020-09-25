// @ts-nocheck
/* global __BASE_DIR__ */

export const requireFile = async ({
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
    .then(text => (text.startsWith('<!') ? false : text))

export const fetchComponentSrcRawFile = ({category, component}) =>
  fetchStaticFile(`/components/${category}/${component}/src/index.js`)

export const fetchMarkdownFile = ({category, component, file}) =>
  fetchStaticFile(`/components/${category}/${component}/${file}.md`)

export const fetchPlayground = ({category, component}) =>
  fetchStaticFile(`/demo/${category}/${component}/playground`)

export const tryRequireTest = async ({category, component}) => {
  return requireFile({
    extractDefault: false,
    importFile: () =>
      import(`${__BASE_DIR__}/test/${category}/${component}/index.js`)
  })
}

export const tryRequireCore = async ({category, component}) => {
  const exports = requireFile({
    extractDefault: false,
    importFile: () =>
      import(
        /* webpackExclude: /\/node_modules\/(.*)\/src\/index.js$/ */
        `${__BASE_DIR__}/components/${category}/${component}/src/index.js`
      )
  })

  const demo = requireFile({
    importFile: () =>
      import(
        /* webpackExclude: /\/node_modules\/(.*)\/demo\/index.js$/ */
        `${__BASE_DIR__}/demo/${category}/${component}/demo/index.js`
      )
  })

  const context = requireFile({
    importFile: () =>
      import(`${__BASE_DIR__}/demo/${category}/${component}/context.js`)
  })

  const events = requireFile({
    importFile: () =>
      import(`${__BASE_DIR__}/demo/${category}/${component}/events.js`)
  })

  return Promise.all([exports, context, events, demo])
}
