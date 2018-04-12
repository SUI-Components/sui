/* global __BASE_DIR__ */
const requireFile = async ({ defaultValue, extractDefault = true, importFile }) => {
  const file = await importFile().catch(_ => defaultValue)
  if (typeof file === 'undefined') {
    return Promise.reject(new Error('Error requiring file'))
  }
  return extractDefault ? file.default : file
}

const reqComponentsSrc =
  require.context(`bundle-loader?lazy!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/src\/index\.jsx?/)

const tryRequire = async ({category, component}) => {
  const exports = new Promise(resolve => {
    require.ensure([], () => {
      let bundler
      try {
        bundler = reqComponentsSrc(`./${category}/${component}/src/index.js`)
      } catch (e) {
        bundler = reqComponentsSrc(`./${category}/${component}/src/index.jsx`)
      }
      bundler(resolve)
    })
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
