/* eslint no-console:0 */
/* global __BASE_DIR__ */

const requireAvailableThemes = require.context(
  `!css-loader!sass-loader!${__BASE_DIR__}/demo`,
  true,
  /^.*\/themes\/.*\.scss/,
  'lazy'
)
const requireComponentStyles = require.context(
  `!css-loader!sass-loader!${__BASE_DIR__}/components`,
  true,
  /^\.\/\w+\/\w+\/src\/index\.scss/,
  'lazy'
)

export const themesFor = ({category, component}) =>
  requireAvailableThemes
    .keys()
    .filter(p => p.includes(`${category}/${component}/`))
    .map(p => p.replace(`./${category}/${component}/themes/`, ''))
    .map(p => p.replace('.scss', ''))

export default /* stylesFor */ async ({
  category,
  component,
  withTheme = 'default'
}) => {
  const componentPath = `${category}/${component}`
  const isDefaultTheme = withTheme === 'default'

  console.info(
    `[sui-studio] Applying new styles for ${componentPath} with theme: ${withTheme}`
  )

  // if we're not using any theme, we load the default styles from the component itself
  // if we've selected a theme, we load the styles for that specific theme
  const stylePath = isDefaultTheme
    ? `./${componentPath}/src/index.scss`
    : `./${componentPath}/themes/${withTheme}.scss`

  // use the correct require method to extract the expected styles
  const requireLazyStyles = isDefaultTheme
    ? requireComponentStyles
    : requireAvailableThemes

  try {
    // extract the `default` property from the ESModule from lazy required styles
    const {default: style} = await requireLazyStyles(stylePath)
    return style
  } catch (e) {
    console.warn(`No styles for ${category}/${component}`)
    console.error(e)
  }
}
