import {expect} from 'chai'
import {rest} from 'msw'

import {FetcherFactory} from '@s-ui/domain'

import {setupContractTests} from '../../src/index.js'
import {getContractFileData, removeContractFiles} from '../utils.js'

const fetcher = FetcherFactory.httpFetcher({config: {}})
const consumer = 'test-consumer'
const fujiAppleResponse = {color: 'red', type: 'Fuji'}
const fujiRottenAppleResponse = {...fujiAppleResponse, isRotten: true}
const applesResponse = [
  fujiAppleResponse,
  {color: 'green', type: 'Granny Smith'}
]
const galaAppleBody = {color: 'red', type: 'Gala'}
const getAppleHandler = rest.get(
  'http://localhost:8181/apples/:slug',
  (req, res, ctx) => {
    const rotten = req.url.searchParams.get('rotten')
    const response = rotten ? fujiRottenAppleResponse : fujiAppleResponse

    return res(ctx.status(200), ctx.json(response))
  }
)

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
        handler: rest.post(
          'http://localhost:8181/apples/add/:slug',
          (req, res, ctx) => res(ctx.status(200))
        ),
        body: galaAppleBody
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
  })
})
