import {writeData2File} from 'pact-msw-adapter/dist/utils/utils.js'
import {stringify} from 'qs'

export const writerFactory = providers => (path, data) => {
  const {interactions, provider} = data
  const {name} = provider

  data.interactions = interactions.map(interaction => {
    const {request} = interaction
    const {path, query} = request
    const definedInteraction = providers[name].find(
      ({endpoint, query: definedQuery}) => {
        const matchedEndpoint = endpoint === path

        if (query) {
          return matchedEndpoint && query === toQueryString(definedQuery)
        }
        return matchedEndpoint
      }
    )
    const {description, state: providerState} = definedInteraction

    return {
      ...interaction,
      description,
      providerState
    }
  })

  console.log(`Writing the Pact file "${path}"`) // eslint-disable-line
  writeData2File(path, data)
}

export const mapProviders = providers =>
  Object.keys(providers).reduce((reducedProviders, key) => {
    const endpoints = providers[key].map(({endpoint, query}) =>
      query ? `${endpoint}?${toQueryString(query)}` : endpoint
    )

    return {
      ...reducedProviders,
      [key]: endpoints
    }
  }, {})

export const getContractTests = ({apiUrl, providers}) =>
  Object.keys(providers).reduce(
    (tests, key) => [...tests, ...providers[key]],
    []
  )

export const toQueryString = (queryParams, options = {}) => {
  const {arrayFormat, delimiter, encode = true} = options
  const mergedOptions = {
    encode,
    ...(typeof arrayFormat !== 'undefined' && {arrayFormat}),
    ...(typeof delimiter !== 'undefined' && {delimiter})
  }

  return stringify(queryParams, mergedOptions)
}
