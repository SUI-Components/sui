/* eslint no-console:0 */
/* global __BASE_DIR__ */

const reqThemePlayGround = require.context(
  `!css-loader!sass-loader!${__BASE_DIR__}/demo`,
  true,
  /^.*\/themes\/.*\.scss/,
  'lazy'
)
const reqComponentsSCSS = require.context(
  `!css-loader!sass-loader!${__BASE_DIR__}/components`,
  true,
  /^\.\/\w+\/\w+\/src\/index\.scss/,
  'lazy'
)

export const themesFor = ({category, component}) =>
  reqThemePlayGround
    .keys()
    .filter(p => p.includes(`${category}/${component}/`))
    .map(p => p.replace(`./${category}/${component}/themes/`, ''))
    .map(p => p.replace('.scss', ''))

export default /* stylesFor */ ({category, component, withTheme = 'default'}) =>
  new Promise(resolve => {
    const componentPath = `${category}/${component}`
    console.groupCollapsed(
      `[sui-studio] Applying new styles for ${componentPath}`
    )
    try {
      console.info('withTheme: ', withTheme)

      const stylePath =
        withTheme === 'default'
          ? `./${componentPath}/src/index.scss`
          : `./${componentPath}/themes/${withTheme}.scss`

      const style =
        withTheme === 'default'
          ? reqComponentsSCSS(stylePath)
          : reqThemePlayGround(stylePath)

      console.info('style path: ', stylePath)
      console.info('style to inject: ', style)

      resolve(style.default)
    } catch (e) {
      console.error(e)
      console.warn(`No styles for ${category}/${component}`)
    }
    console.groupEnd()
  })
