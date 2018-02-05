/* eslint-disable no-console */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Hello from './hello'

// eslint-next-disable-line
import(/* webpackChunkName: "my-chunk-name" */ './foo')
  .then(a => console.log('loaded async chunk'))

// https://webpack.js.org/guides/hmr-react/#components/sidebar/sidebar.jsx
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
render(Hello)

if (module.hot) {
  module.hot.accept('./hello', () => render(require('./hello').default))
}
