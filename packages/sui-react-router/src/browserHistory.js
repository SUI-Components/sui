/* eslint-disable react-hooks/rules-of-hooks */

// from: https://github.com/ReactTraining/react-router/blob/v3/modules/useRouterHistory.js

import createBrowserHistory from 'history/lib/createBrowserHistory'
import useBasename from 'history/lib/useBasename'
import useQueries from 'history/lib/useQueries'

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export default function() {
  return canUseDOM ? useQueries(useBasename(createBrowserHistory))() : undefined
}
