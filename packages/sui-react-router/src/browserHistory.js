/* eslint-disable react-hooks/rules-of-hooks */

// from: https://github.com/ReactTraining/react-router/blob/v3/modules/useRouterHistory.js
import canUseDOM from './internal/canUseDOM'
import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from './createMemoryHistory'
import useHistoryLocationQuery from './internal/useHistoryLocationQuery'

/** If we're on the server, we must be sure importing this file doesn't break anything */
const browserHistory = canUseDOM
  ? useHistoryLocationQuery(createBrowserHistory())
  : createMemoryHistory()

export default browserHistory
