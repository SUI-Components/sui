/* global __BASE_DIR__ */

const reqComponentsReadme =
  require.context(`bundle-loader?lazy!raw-loader!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/README\.md?/)

// https://webpack.github.io/docs/loaders.html#loader-order
const reqComponentsSrcIndex =
  require.context(`!!bundle-loader?lazy!raw-loader!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/src\/index\.jsx?/)

const reqComponentsSrcComponent =
  require.context(`!!bundle-loader?lazy!raw-loader!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/src\/component\.jsx?/)

const tryRequire = ({category, component}) => {
  const src = new Promise(resolve => {
    require.ensure([], () => {
      let bundler

      if (!bundler && reqComponentsSrcComponent.keys().includes(`./${category}/${component}/src/component.js`)) {
        bundler = reqComponentsSrcComponent(`./${category}/${component}/src/component.js`)
      }
      if (!bundler && reqComponentsSrcComponent.keys().includes(`./${category}/${component}/src/component.jsx`)) {
        bundler = reqComponentsSrcComponent(`./${category}/${component}/src/component.jsx`)
      }
      if (!bundler && reqComponentsSrcIndex.keys().includes(`./${category}/${component}/src/index.js`)) {
        bundler = reqComponentsSrcIndex(`./${category}/${component}/src/index.js`)
      }
      if (!bundler && reqComponentsSrcIndex.keys().includes(`./${category}/${component}/src/index.jsx`)) {
        bundler = reqComponentsSrcIndex(`./${category}/${component}/src/index.jsx`)
      }

      bundler(src => resolve(src))
    })
  })

  const readme = new Promise(resolve => {
    require.ensure([], () => {
      try {
        const bundler = reqComponentsReadme(`./${category}/${component}/README.md`)
        bundler(src => resolve(src))
      } catch (e) {
        return resolve(`### ${category}/${component} no tiene README`)
      }
    })
  })

  return Promise.all([src, readme])
}

export default tryRequire
