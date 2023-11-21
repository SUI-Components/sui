import {Redirect, Route} from '@s-ui/react-router'

import Demo from './components/demo/index.js'
import Api from './components/documentation/Api.js'
import Documentation from './components/documentation/index.js'
import MarkdownFile from './components/documentation/MarkdownFile.js'
import Layout from './components/layout/index.js'
import Workbench from './components/workbench/index.js'
import {FILES} from './constants.js'

export default (
  <Route>
    <Redirect from="workbench/:category/:component" to="/workbench/:category/:component/demo" />
    <Route path="/" component={Layout}>
      <Route path="workbench/:category/:component" component={Workbench}>
        <Route path="demo" component={Demo} />
        <Route path="documentation" component={Documentation}>
          <Route path="api" component={Api} />
          <Route path="readme" component={props => <MarkdownFile {...props} file={FILES.README} />} />
          <Route path="changelog" component={props => <MarkdownFile {...props} file={FILES.CHANGELOG} />} />
        </Route>
      </Route>
    </Route>
    <Redirect from="**" to="/" />
  </Route>
)
