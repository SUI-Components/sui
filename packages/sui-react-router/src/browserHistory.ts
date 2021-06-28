/* eslint-disable react-hooks/rules-of-hooks */

// from: https://github.com/ReactTraining/react-router/blob/v3/modules/useRouterHistory.js
import canUseDOM from './internal/canUseDOM'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import useBasename from 'history/lib/useBasename'
import useQueries from 'history/lib/useQueries'
import createMemoryHistory from './createMemoryHistory'

/** If we're on the server, we must be sure importing this file doesn't break anything */
const browserHistory = canUseDOM
  ? useQueries(useBasename(createBrowserHistory))()
  : createMemoryHistory()

export default browserHistory
