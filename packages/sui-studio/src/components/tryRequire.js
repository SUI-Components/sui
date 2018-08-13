/* global __BASE_DIR__ */
const requireContextSrc = require.context(
  `bundle-loader?lazy!${__BASE_DIR__}/components`,
  true,
  /^\.\/\w+\/\w+\/src\/index\.jsx?/
)

const requireContextRawSrc = require.context(
  `!!bundle-loader?lazy!!raw-loader!${__BASE_DIR__}/components`,
  true,
  /^\.\/\w+\/\w+\/src\/index\.jsx?/
)

const tryRequireSrc = ({category, component, requireContext}) => {
  return new Promise(resolve => {
    require.ensure([], () => {
      const indexFilePath = `./${category}/${component}/src/index.js`
      const bundler = requireContext.keys().includes(indexFilePath)
        ? requireContext(indexFilePath)
        : requireContext(`${indexFilePath}x`) // try with jsx file
      bundler(resolve)
    })
  })
}

const requireFile = async ({
  defaultValue,
  extractDefault = true,
  importFile
}) => {
  const file = await importFile().catch(_ => defaultValue)
  if (typeof file === 'undefined') {
    return Promise.reject(new Error('Error requiring file'))
  }
  return extractDefault ? file.default : file
}

export const tryRequireMarkdown = async ({category, component, file}) => {
  return requireFile({
    defaultValue: '',
    importFile: () =>
      import(/* webpackExclude: /\/node_modules\/(.*)\/(\w+).md$/ */
      `!raw-loader!${__BASE_DIR__}/components/${category}/${component}/${file}.md`)
  })
}

export const tryRequireRawSrc = ({category, component}) => {
  return tryRequireSrc({
    category,
    component,
    requireContext: requireContextRawSrc
  })
}

export const tryRequireCore = async ({category, component}) => {
  const exports = tryRequireSrc({
    category,
    component,
    requireContext: requireContextSrc
  })

  const pkg = requireFile({
    defaultValue: {dependencies: {}},
    importFile: () =>
      import(/* webpackExclude: /\/node_modules\/(.*)\/package.json$/ */
      `${__BASE_DIR__}/components/${category}/${component}/package.json`)
  })

  const playground = requireFile({
    defaultValue: false,
    importFile: () =>
      import(`!raw-loader!${__BASE_DIR__}/demo/${category}/${component}/playground`)
  })

  const demo = requireFile({
    defaultValue: false,
    importFile: () =>
      import(/* webpackExclude: /\/node_modules\/(.*)\/demo\/index.js$/ */
      `${__BASE_DIR__}/demo/${category}/${component}/demo/index.js`)
  })

  const context = requireFile({
    defaultValue: false,
    importFile: () =>
      import(`${__BASE_DIR__}/demo/${category}/${component}/context.js`)
  })

  const events = requireFile({
    defaultValue: false,
    importFile: () =>
      import(`${__BASE_DIR__}/demo/${category}/${component}/events.js`)
  })

  return Promise.all([exports, playground, context, events, pkg, demo])
}
