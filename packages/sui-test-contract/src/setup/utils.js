import {stringify} from 'qs'

import {createWriter} from '@pactflow/pact-msw-adapter/dist/utils/utils.js'

const flatEntries = (input, prefix = '') =>
  Object.entries(input).flatMap(([key, value]) => {
    const isObject = typeof value === 'object'
    return isObject ? flatEntries(value, `${prefix}${key}.`) : {[`${prefix}${key}`]: {match: 'type'}}
  })

const reduceArrayToObject = items => items.reduce((objAcc, item) => ({...objAcc, ...item}), {})

const getMatchingRules = body => {
  const matchingRulesArray = flatEntries(body, '$.body.')
  const matchingRules = reduceArrayToObject(matchingRulesArray)
  return matchingRules
}

export const writerFactory = providers => (path, data) => {
  const {interactions, provider} = data
  const {name} = provider

  data.interactions = interactions.map(interaction => {
    const {request} = interaction
    const {path, query, body} = request

    const definedInteraction = providers[name].find(({endpoint, query: definedQuery, body: definedBody}) => {
      const matchedEndpoint = endpoint === path

      if (query) {
        return matchedEndpoint && query === toQueryString(definedQuery)
      }
      if (body) {
        return matchedEndpoint && stringify(body) === stringify(definedBody)
      }
      return matchedEndpoint
    })

    const {description, state: providerState, addMatchingRules} = definedInteraction

    return {
      ...interaction,
      response: {
        ...interaction.response,
        ...(addMatchingRules && {
          matchingRules: getMatchingRules(interaction.response.body)
        })
      },
      description,
      providerState
    }
  })

  console.log(`Writing the Pact file "${path}"`) // eslint-disable-line
  createWriter()(path, data)
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
  Object.keys(providers).reduce((tests, key) => [...tests, ...providers[key]], [])

export const toQueryString = (queryParams, options = {}) => {
  const {arrayFormat, delimiter, encode = true} = options
  const mergedOptions = {
    encode,
    ...(typeof arrayFormat !== 'undefined' && {arrayFormat}),
    ...(typeof delimiter !== 'undefined' && {delimiter})
  }

  return stringify(queryParams, mergedOptions)
}
