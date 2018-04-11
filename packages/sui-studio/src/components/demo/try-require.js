/* global __BASE_DIR__ */
const requireFile = async ({ defaultValue, extractDefault = true, importFile }) => {
  const file = await importFile().catch(_ => defaultValue)
  if (typeof file === 'undefined') {
    return Promise.reject(new Error('Error requiring file'))
  }
  return extractDefault ? file.default : file
}

const tryRequire = async ({category, component}) => {
  const exports = requireFile({
    extractDefault: false,
    importFile: () => import(`${__BASE_DIR__}/components/${category}/${component}/src/index.js`).catch(_ =>
      import(`${__BASE_DIR__}/components/${category}/${component}/src/index.jsx`)
    )
  })

  const pkg = requireFile({
    defaultValue: { dependencies: {} },
    importFile: () => import(`${__BASE_DIR__}/components/${category}/${component}/package.json`),
  })

  const playground = requireFile({
    importFile: () => import(`!raw-loader!${__BASE_DIR__}/demo/${category}/${component}/playground`)
  })

  const context = requireFile({
    defaultValue: false,
    importFile: () => import(`${__BASE_DIR__}/demo/${category}/${component}/context.js`)
  })

  const events = requireFile({
    defaultValue: false,
    importFile: () => import(`${__BASE_DIR__}/demo/${category}/${component}/events.js`)
  })

  return Promise.all([exports, playground, context, events, pkg])
}

export default tryRequire
