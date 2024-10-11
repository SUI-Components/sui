import React from 'react'

import {Route} from '@s-ui/react-router'

const DummyComponent = () => <h1>Test</h1>

export default (
  <Route>
    <Route path="/mi-cuenta" component={DummyComponent} />
  </Route>
)
