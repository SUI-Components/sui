/* eslint-disable no-console, no-undef, import/no-webpack-loader-syntax */
import {render, browserHistory} from 'react-dom'
import {Router, Route, Redirect} from '@s-ui/react-router'

import {isFunction} from '../../src/components/demo/utilities.js'
import {importGlobals} from '../../src/components/globals.js'
import Workbench from './components/Workbench/index.js'

import './styles.scss'

const importAll = requireContext => requireContext.keys().map(requireContext)

;(async () => {
  const {default: defaultStyle} = await import('!css-loader!@s-ui/sass-loader!component/index.scss')

  let styles = []
  let requireContextThemesKeys = []

  try {
    /**
     * TODO: In this case, it seems that we're getting twice the same theme
     * Example:
     * [
     *  "./adevinta.scss",
     *  "components/atom/button/demo/themes/adevinta.scss"
     * ]
     * We might want to filter those to avoid importAll to import twice the same
     */
    const requireContextThemes = require.context('!css-loader!@s-ui/sass-loader!demo/themes', false, /\.scss$/)
    requireContextThemesKeys = requireContextThemes.keys()
    styles = importAll(requireContextThemes)
  } catch {}

  let ctxt = {}
  try {
    ctxt = require('demo/context').default
  } catch {}

  let DemoComponent
  try {
    DemoComponent = require('demo').default
  } catch {}

  let demoStyles = ''
  try {
    demoStyles = require('!css-loader!@s-ui/sass-loader!demo/index.scss') // eslint-disable-line
  } catch {}

  const contexts = isFunction(ctxt) ? await ctxt() : ctxt
  const themes = requireContextThemesKeys.reduce((acc, path, index) => {
    const filename = path.indexOf('/') ? path.split('/').reverse()[0] : path

    const themeName = filename.replace('./', '').replace('.scss', '')

    const style = styles[index]
    acc[themeName] = style.default || style
    return acc
  }, {})

  await importGlobals()

  render(
    <Router
      history={browserHistory}
      routes={
        <Route>
          <Route
            path="/"
            component={(...props) => (
              <Workbench
                componentID={__COMPONENT_ID__}
                contexts={contexts}
                demo={DemoComponent}
                themes={{...themes, default: demoStyles?.default || defaultStyle}}
                {...props}
              />
            )}
          />
          <Redirect from="**" to="/" />
        </Route>
      }
    />,
    document.getElementById('app')
  )
})()
