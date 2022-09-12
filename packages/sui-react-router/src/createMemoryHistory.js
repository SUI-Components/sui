// @ts-check
/* eslint-disable react-hooks/rules-of-hooks */

// from: https://github.com/ReactTraining/react-router/blob/v3/modules/createMemoryHistory.js

import baseCreateMemoryHistory from 'history/lib/createMemoryHistory'
import useBasename from 'history/lib/useBasename'
import useQueries from 'history/lib/useQueries'

export default function createMemoryHistory(options) {
  // signatures and type checking differ between `useQueries` and
  // `createMemoryHistory`, have to create `memoryHistory` first because
  // `useQueries` doesn't understand the signature
  const memoryHistory = baseCreateMemoryHistory(options)
  const createHistory = () => memoryHistory
  return useQueries(useBasename(createHistory))(options)
}
