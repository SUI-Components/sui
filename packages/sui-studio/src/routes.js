import {Route, Redirect} from '@s-ui/react-router'
import Layout from './components/layout'
import Workbench from './components/workbench'
import Demo from './components/demo'
import Documentation from './components/documentation'
import Api from './components/documentation/Api'
import MarkdownFile from './components/documentation/MarkdownFile'

import {FILES} from './constants'

export default (
  <Route>
    <Redirect
      from="workbench/:category/:component"
      to="/workbench/:category/:component/demo"
    />
    <Route path="/" component={Layout}>
      <Route path="workbench/:category/:component" component={Workbench}>
        <Route path="demo" component={Demo} />
        <Route path="documentation" component={Documentation}>
          <Route path="api" component={Api} />
          <Route
            path="readme"
            component={props => <MarkdownFile {...props} file={FILES.README} />}
          />
          <Route
            path="changelog"
            component={props => (
              <MarkdownFile {...props} file={FILES.CHANGELOG} />
            )}
          />
          <Route
            path="uxdef"
            component={props => (
              <MarkdownFile {...props} file={FILES.UX_DEFINITION} />
            )}
          />
        </Route>
      </Route>
    </Route>
    <Redirect from="**" to="/" />
  </Route>
)
