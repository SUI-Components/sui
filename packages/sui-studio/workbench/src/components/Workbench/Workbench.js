import {useState} from 'react'

import usePrefersColorScheme from 'use-prefers-color-scheme'

import Raw from '../Raw/index.js'
import Root from '../Root/index.js'
import queryStringToJSON from './queryStringToJSON.js'

const Workbench = ({...rest}) => {
  const colorScheme = usePrefersColorScheme()
  const [theme, setTheme] = useState(colorScheme)

  const params = queryStringToJSON(window.location.href)

  const {raw} = params

  const [Component, props] = raw
    ? [Raw, {themeMode: theme, ...rest}]
    : [Root, {themeMode: theme, setThemeMode: setTheme, ...rest}]

  return <Component {...props} />
}

Workbench.displayName = 'Workbench'

Workbench.propTypes = {}

export default Workbench
