/**
 * In order to inject data into the html needed by any context provider
 * that later on needs that data to load as initial value when client side rendering,
 * sui-ssr will check and execute the context.getInitialData fn
 * and will inject it as window.__INITIAL_CONTEXT_VALUE__.[your context key]
 */

export const INITIAL_CONTEXT_VALUE = '__INITIAL_CONTEXT_VALUE__'

/**
 * @param {Object[]} context
 * @param {function=} context.getInitialData
 * @returns {Object}
 */
export const getInitialContextValue = context =>
  Object.keys(context)
    .filter(
      contextKey => typeof context[contextKey].getInitialData === 'function'
    )
    .reduce((acc, contextKey) => {
      acc[contextKey] = context[contextKey].getInitialData()
      return acc
    }, {})
