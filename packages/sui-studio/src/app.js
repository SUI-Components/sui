import '@s-ui/polyfills'
import React from 'react'
import reactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Root from './components/root'

const render = Component =>
  reactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
render(Root)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app.js')
  module.hot.accept('./components/root', () => render(require('./components/root').default))
}
