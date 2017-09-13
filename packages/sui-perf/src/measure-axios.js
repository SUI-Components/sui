let requestCount = 0

/**
 * Return a unique label for given axios request
 * @param  {Object} config Axios request config
 * @param  {Object} config.method
 * @param  {Object} config.url
 * @return {String}
 */
const getRequestLabel = ({ method, url }) => {
  return `🌎  ${method.toUpperCase()} /${url} #${++requestCount}`
}

/**
 *
 * Params are curried
 * @param  {Object} perf Instance of performance marker
 * @param  {Function} perf.mark
 * @param  {Function} perf.stop
 * @param  {Object} axios Instance of axios
 * @return {Function} Function to unregister performance hooks
 */
const measureAxios = (perf) => (axios) => {
  const interceptor = axios.interceptors.request.use((config) => {
    const axiosRequestId = getRequestLabel(config)
    perf.mark(axiosRequestId)
    config.transformResponse.axiosPerformanceTransform = (data, headers) => {
      perf.stop(axiosRequestId)
      return data
    }
    return config
  })
  return () => axios.interceptors.request.eject(interceptor)
}

export default measureAxios
