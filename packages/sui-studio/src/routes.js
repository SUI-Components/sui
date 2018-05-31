import React from 'react'
import {IndexRedirect, Route, Redirect} from 'react-router'

import Layout from './components/layout'
import Workbench from './components/workbench'
import Demo from './components/demo'
import Tests from './components/tests'
import Documentation from './components/documentation'
import Api from './components/documentation/Api'
import MarkdownFile from './components/documentation/MarkdownFile'

export default (
  <Route>
    <Route path="/" component={Layout}>
      <Route path="workbench/:category/:component" component={Workbench}>
        <IndexRedirect to="demo" />
        <Route path="demo" component={Demo} />
        <Route path="documentation" component={Documentation}>
          <Route path="api" component={Api} />
          <Route
            path="readme"
            component={props => <MarkdownFile {...props} file="README" />}
          />
          <Route
            path="changelog"
            component={props => <MarkdownFile {...props} file="CHANGELOG" />}
          />
        </Route>
        <Route path="tests" component={Tests} />
      </Route>
    </Route>
    <Redirect from="**" to="/" />
  </Route>
)
