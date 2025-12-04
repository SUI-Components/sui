const MPI_CONFIG_KEY = '__mpi'

export const isClient = typeof window !== 'undefined'

/**
 * Get the Segment Wrapper config from window
 * @param {string=} key Key config to extract. If not provided, all the config will be returned
 * @return {any} Config value or all the config if not key provided
 */
export const getConfig = key => {
  const config = window?.[MPI_CONFIG_KEY]?.segmentWrapper || {}

  return key ? config[key] : config
}

/**
 * Set a config value to the Segment Wrapper config
 * @param {string} key Config key to update
 * @param {boolean|string|number|object} value Value to set on the config key
 */
export const setConfig = (key, value) => {
  window[MPI_CONFIG_KEY] = window[MPI_CONFIG_KEY] || {}
  window[MPI_CONFIG_KEY].segmentWrapper = window[MPI_CONFIG_KEY].segmentWrapper || {}
  window[MPI_CONFIG_KEY].segmentWrapper[key] = value
}
