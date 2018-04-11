import React from 'react'
import reactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Root from './components/root'

reactDOM.render(
  <AppContainer>
    <Root />
  </AppContainer>,
  document.getElementById('root')
)
