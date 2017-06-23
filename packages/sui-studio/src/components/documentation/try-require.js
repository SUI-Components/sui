/* global __BASE_DIR__ */

const reqComponentsReadme =
  require.context(`bundle-loader?lazy!raw-loader!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/README\.md?/)

// https://webpack.github.io/docs/loaders.html#loader-order
const reqComponentsSrc =
  require.context(`!!bundle-loader?lazy!raw-loader!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/src\/index\.jsx?/)

const tryRequire = ({category, component}) => {
  const src = new Promise(resolve => {
    require.ensure([], () => {
      let bundler
      try {
        bundler = reqComponentsSrc(`./${category}/${component}/src/index.js`)
      } catch (e) {
        bundler = reqComponentsSrc(`./${category}/${component}/src/index.jsx`)
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
