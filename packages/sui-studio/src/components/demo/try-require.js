/* global __BASE_DIR__ */

const reqComponentsSrc =
  require.context(`bundle-loader?lazy!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/src\/index\.jsx?/)

console.log(__BASE_DIR__)

const requireFile = async ({ defaultValue, importFile }) => {
  const file = await importFile().catch(_ => defaultValue)
  return typeof file === 'undefined'
    ? Promise.reject(new Error('Error requiring file'))
    : file.default
}

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
    importFile: () => import(`${__BASE_DIR__}/components/${category}/${component}/package.json`),
    defaultValue: { dependencies: {} }
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
