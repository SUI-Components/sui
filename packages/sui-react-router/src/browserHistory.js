// @ts-check
/* eslint-disable react-hooks/rules-of-hooks */

// from: https://github.com/ReactTraining/react-router/blob/v3/modules/useRouterHistory.js
import canUseDOM from './internal/canUseDOM.js'
import {
  createHistory as createBrowserHistory,
  createMemoryHistory,
  useBasename,
  useQueries
} from 'history'

/** If we're on the server, we must be sure importing this file doesn't break anything */
const browserHistory = canUseDOM
  ? useQueries(useBasename(createBrowserHistory))()
  : createMemoryHistory()

export default browserHistory
