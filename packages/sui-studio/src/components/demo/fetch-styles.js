/* eslint-disable no-console, import/no-webpack-loader-syntax */
/* global __BASE_DIR__ */

const requireAvailableThemes = require.context(
  `!css-loader!@s-ui/sass-loader!${__BASE_DIR__}/components`,
  true,
  /^\.\/\w+\/\w+\/demo\/themes\/.*\.scss/,
  'lazy'
)
const requireComponentStyles = require.context(
  `!css-loader!@s-ui/sass-loader!${__BASE_DIR__}/components`,
  true,
  /^\.\/\w+\/\w+\/(src|demo)\/index\.scss/,
  'lazy'
)

export const themesFor = ({category, component}) =>
  requireAvailableThemes
    .keys()
    .filter(p => p.includes(`${category}/${component}/`))
    .map(p => p.replace(`./${category}/${component}/demo/themes/`, ''))
    .map(p => p.replace('.scss', ''))

export default /* stylesFor */ async ({category, component, withTheme = 'default'}) => {
  const componentPath = `${category}/${component}`
  const isDefaultTheme = withTheme === 'default'

  console.info(`[sui-studio] Applying new styles for ${componentPath} with theme: ${withTheme}`)

  // use the correct require method to extract the expected styles
  const requireLazyStyles = isDefaultTheme ? requireComponentStyles : requireAvailableThemes

  // if we're not using any theme, we load the default styles from its demo or the component itself default styles.
  // if we've selected a theme, we load the styles for that specific theme
  const stylePath = requireLazyStyles.keys().find(fileName => {
    if (!isDefaultTheme && `./${componentPath}/demo/themes/${withTheme}.scss` === fileName) {
      return `./${componentPath}/demo/themes/${withTheme}.scss`
    } else if (`./${componentPath}/demo/index.scss` === fileName) {
      return fileName
    } else if (`./${componentPath}/src/index.scss` === fileName) {
      return fileName
    }

    return false
  })
  try {
    // extract the `default` property from the ESModule from lazy required styles
    const {default: style} = await requireLazyStyles(stylePath)
    return style
  } catch (e) {
    console.warn(`No styles for ${category}/${component}`)
    console.error(e)
  }
}
