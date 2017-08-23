/* global __BASE_DIR__ */

const reqComponentsMarkdown =
  require.context(`bundle-loader?lazy!raw-loader!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/(README|CHANGELOG)\.md?/)

// https://webpack.github.io/docs/loaders.html#loader-order
const reqComponentsSrcIndex =
  require.context(`!!bundle-loader?lazy!raw-loader!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/src\/index\.jsx?/)

const reqComponentsSrcComponent =
  require.context(`!!bundle-loader?lazy!raw-loader!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/src\/component\.jsx?/)

const getMarkdownFile = (category, component, fileName) => new Promise(resolve => {
  require.ensure([], () => {
    try {
      const bundler = reqComponentsMarkdown(`./${category}/${component}/${fileName}.md`)
      bundler(src => resolve(src))
    } catch (e) {
      return resolve(`### ${category}/${component} does not contain any ${fileName}.md file`)
    }
  })
})

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

  const readme = getMarkdownFile(category, component, 'README')
  const changelog = getMarkdownFile(category, component, 'CHANGELOG')

  return Promise.all([src, readme, changelog])
}

export default tryRequire
