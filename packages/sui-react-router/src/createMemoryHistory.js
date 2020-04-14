/* eslint-disable react-hooks/rules-of-hooks */

// from: https://github.com/ReactTraining/react-router/blob/v3/modules/createMemoryHistory.js

import useQueries from 'history/lib/useQueries'
import useBasename from 'history/lib/useBasename'
import baseCreateMemoryHistory from 'history/lib/createMemoryHistory'

export default function createMemoryHistory(options) {
  // signatures and type checking differ between `useQueries` and
  // `createMemoryHistory`, have to create `memoryHistory` first because
  // `useQueries` doesn't understand the signature
  const memoryHistory = baseCreateMemoryHistory(options)
  const createHistory = () => memoryHistory
  return useQueries(useBasename(createHistory))(options)
}
