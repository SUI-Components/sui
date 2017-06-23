/* eslint no-console:0 */
/* global __BASE_DIR__ */

const reqThemePlayGround = require.context(`!css-content-loader!css-loader!sass-loader!${__BASE_DIR__}/demo`, true, /^.*\/themes\/.*\.scss/)
const reqComponentsSCSS = require.context(`!css-content-loader!css-loader!sass-loader!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/src\/index\.scss/)

export const themesFor = ({category, component}) =>
  reqThemePlayGround.keys()
    .filter(p => p.includes(`${category}/${component}`))
    .map(p => p.replace(`./${category}/${component}/themes/`, ''))
    .map(p => p.replace('.scss', ''))

export default /* stylesFor */ ({category, component, withTheme = 'default'} = {}) =>
  new Promise(resolve => {
    let style
    require.ensure([], () => {
      try {
        if (withTheme === 'default') {
          style = reqComponentsSCSS(`./${category}/${component}/src/index.scss`)
          console.groupCollapsed()
          console.info(`ADD styles ./${category}/${component}/src/index.scss`)
          console.log(style)
          console.groupEnd()
        } else {
          style = reqThemePlayGround(`./${category}/${component}/themes/${withTheme}.scss`)
          console.groupCollapsed()
          console.info(`ADD styles ./${category}/${component}/themes/${withTheme}.scss`)
          console.log(style)
          console.groupEnd()
        }
        console.log(withTheme)
        resolve(style)
      } catch (e) { console.warn(`No styles for ${category}/${component}`) }
    })
  })
