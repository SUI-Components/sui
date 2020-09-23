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

export const tryRequireTest = async ({category, component}) => {
  return requireFile({
    extractDefault: false,
    importFile: () =>
      import(`${__BASE_DIR__}/test/${category}/${component}/index.js`)
  })
}

export const tryRequireMarkdown = async ({category, component, file}) => {
  return requireFile({
    defaultValue: '',
    importFile: () =>
      import(
        /* webpackExclude: /\/node_modules\/(.*)\/(\w+).md$/ */
        `!raw-loader!${__BASE_DIR__}/components/${category}/${component}/${file}.md`
      )
  })
}

export const tryRequireRawSrc = ({category, component}) => {
  return requireFile({
    defaultValue: '',
    importFile: () =>
      import(
        /* webpackExclude: /\/node_modules\/(.*)\/src\/index.js$/ */
        `!raw-loader!${__BASE_DIR__}/components/${category}/${component}/src/index.js`
      )
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

  const pkg = requireFile({
    defaultValue: {dependencies: {}},
    importFile: () =>
      import(
        /* webpackExclude: /\/node_modules\/(.*)\/package.json$/ */
        `${__BASE_DIR__}/components/${category}/${component}/package.json`
      )
  })

  const playground = requireFile({
    importFile: () =>
      import(
        `!raw-loader!${__BASE_DIR__}/demo/${category}/${component}/playground`
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

  return Promise.all([exports, playground, context, events, pkg, demo])
}
