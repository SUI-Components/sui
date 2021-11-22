import {serverGetVariation, clientGetVariation} from './getVariation'

import {serverGetForcedValue, clientGetForcedValue} from './getForcedValue'

const getServerStrategy = () => ({
  getVariation: serverGetVariation,
  getForcedValue: serverGetForcedValue
})

const getBrowserStrategy = () => ({
  getVariation: clientGetVariation,
  getForcedValue: clientGetForcedValue
})

/**
 * Returns the implementation of experiment related methods depending on
 * which platform we are server/browser
 * @returns object
 */
export const getPlatformStrategy = () => {
  const isNode = typeof window === 'undefined'

  if (isNode) {
    return getServerStrategy()
  }

  return getBrowserStrategy()
}
