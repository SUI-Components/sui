import {expect} from 'chai'

import {FetcherFactory} from '@s-ui/domain'
import mock from '@s-ui/mock'

import {setupContractTests} from '../../src/index.js'
import {getContractFileData, removeContractFiles} from '../utils.js'

const {rest} = mock
const fetcher = FetcherFactory.httpFetcher({config: {}})
const consumer = 'test-consumer'
const fujiAppleResponse = {color: 'red', type: 'Fuji'}
const fujiRottenAppleResponse = {...fujiAppleResponse, isRotten: true}
const applesResponse = [fujiAppleResponse, {color: 'green', type: 'Granny Smith'}]
const gardenResponse = {
  grassColor: '#34eb4f',
  size: {
    height: 86,
    width: 96
  },
  trees: [fujiAppleResponse, {color: 'green', type: 'Granny Smith'}]
}
const galaAppleBody = {color: 'red', type: 'Gala'}
const getAppleHandler = rest.get('http://localhost:8181/apples/:slug', (req, res, ctx) => {
  const rotten = req.url.searchParams.get('rotten')
  const response = rotten ? fujiRottenAppleResponse : fujiAppleResponse

  return res(ctx.status(200), ctx.json(response))
})
const notFoundResponse = {code: 'not-found'}

setupContractTests({
  apiUrl: 'http://localhost:8181',
  consumer,
  fetcher,
  providers: {
    'test-provider': [
      {
        endpoint: '/apples',
        description: 'A request for getting some apples',
        state: 'I have some apples',
        handler: rest.get('http://localhost:8181/apples', (req, res, ctx) =>
          res(ctx.status(200), ctx.json(applesResponse))
        ),
        response: applesResponse
      },
      {
        endpoint: '/apples/fuji',
        description: 'A request for getting a Fuji apple',
        state: 'I have a Fuji apple',
        handler: getAppleHandler,
        response: fujiAppleResponse
      },
      {
        endpoint: '/apples/fuji',
        query: {rotten: 'true'},
        description: 'A request for getting a Fuji rotten apple',
        state: 'I have a Fuji rotten apple',
        handler: getAppleHandler,
        response: fujiRottenAppleResponse
      },
      {
        endpoint: '/apples/add/gala',
        description: 'A request for adding a Gala apple',
        state: "I've added a Gala apple",
        method: 'post',
        handler: rest.post('http://localhost:8181/apples/add/:slug', (req, res, ctx) => res(ctx.status(200))),
        body: galaAppleBody
      },
      {
        endpoint: '/apples/add/gala',
        description: 'A request for adding a Gala apple with a different color',
        state: "I've added a Gala apple with a different color",
        method: 'post',
        handler: rest.post('http://localhost:8181/apples/add/:slug', (req, res, ctx) => res(ctx.status(200))),
        body: {color: 'yellow', type: 'Gala'}
      },
      {
        endpoint: '/apples/garden',
        description: 'A request for getting a garden',
        state: 'I have a garden',
        handler: rest.get('http://localhost:8181/apples/garden', (req, res, ctx) =>
          res(ctx.status(200), ctx.json(gardenResponse))
        ),
        response: gardenResponse,
        addMatchingRules: true
      },
      {
        endpoint: '/apples/search/garden',
        description: 'A request for getting a garden that fails',
        state: 'I have not garden',
        handler: rest.get('http://localhost:8181/apples/search/garden', (req, res, ctx) =>
          res(ctx.status(404), ctx.json(notFoundResponse))
        ),
        response: notFoundResponse
      }
    ]
  }
})

describe('Contract files generated', () => {
  after(() => {
    removeContractFiles({consumer})
  })

  it('should generate the contract file properly', () => {
    const data = getContractFileData({
      consumer,
      description: 'A request for getting some apples'
    })

    expect(data).to.not.undefined
  })

  it('should generate the contract when doing a request for getting some apples', () => {
    const data = getContractFileData({
      consumer,
      description: 'A request for getting some apples'
    })
    const {providerState, response} = data

    expect(providerState).to.eql('I have some apples')
    expect(response.status).to.eql(200)
    expect(response.body).to.eql(applesResponse)
    expect(response.matchingRules).to.not.exist
  })

  it('should generate the contract when doing a request for getting a Fuji apple', () => {
    const data = getContractFileData({
      consumer,
      description: 'A request for getting a Fuji apple'
    })
    const {providerState, response} = data

    expect(providerState).to.eql('I have a Fuji apple')
    expect(response.status).to.eql(200)
    expect(response.body).to.eql(fujiAppleResponse)
    expect(response.matchingRules).to.not.exist
  })

  it('should generate the contract when doing a request for getting a Fuji rotten apple', () => {
    const data = getContractFileData({
      consumer,
      description: 'A request for getting a Fuji rotten apple'
    })
    const {providerState, response} = data

    expect(providerState).to.eql('I have a Fuji rotten apple')
    expect(response.status).to.eql(200)
    expect(response.body).to.eql(fujiRottenAppleResponse)
    expect(response.matchingRules).to.not.exist
  })

  it('should generate the contract when doing a request for adding a Gala apple', () => {
    const data = getContractFileData({
      consumer,
      description: 'A request for adding a Gala apple'
    })
    const {providerState, response, request} = data

    expect(providerState).to.eql("I've added a Gala apple")
    expect(request.method).to.eql('POST')
    expect(request.body).to.eql(galaAppleBody)
    expect(response.status).to.eql(200)
    expect(response.matchingRules).to.not.exist
  })

  it('should generate the contract when doing a request for adding a Gala apple with a different color', () => {
    const data = getContractFileData({
      consumer,
      description: 'A request for adding a Gala apple with a different color'
    })
    const {providerState, response, request} = data

    expect(providerState).to.eql("I've added a Gala apple with a different color")
    expect(request.method).to.eql('POST')
    expect(request.body).to.eql({color: 'yellow', type: 'Gala'})
    expect(response.status).to.eql(200)
  })

  it('should generate the contract when doing a not found request', () => {
    const data = getContractFileData({
      consumer,
      description: 'A request for getting a garden that fails'
    })
    const {providerState, response, request} = data

    expect(providerState).to.eql('I have not garden')
    expect(request.method).to.eql('GET')
    expect(response.body).to.eql(notFoundResponse)
    expect(response.status).to.eql(404)
    expect(response.matchingRules).to.not.exist
  })

  it('should generate the contract with Pact matchers when doing a request for getting a garden', () => {
    const data = getContractFileData({
      consumer,
      description: 'A request for getting a garden'
    })
    const {providerState, response} = data

    expect(providerState).to.eql('I have a garden')
    expect(response.status).to.eql(200)
    expect(response.body).to.eql(gardenResponse)
    expect(response.matchingRules).to.deep.equal({
      '$.body.grassColor': {match: 'type'},
      '$.body.size.height': {match: 'type'},
      '$.body.size.width': {match: 'type'},
      '$.body.trees.0.color': {match: 'type'},
      '$.body.trees.0.type': {match: 'type'},
      '$.body.trees.1.color': {match: 'type'},
      '$.body.trees.1.type': {match: 'type'}
    })
  })
})
