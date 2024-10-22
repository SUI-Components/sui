import sinon from 'sinon'

import {referrerState, updatePageReferrer, utils as referrerUtils} from '../src/middlewares/source/pageReferrer.js'

const IDENTIFY_TIMEOUT = 300 // from https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify

export const cleanWindowStubs = () => {
  delete window.analytics
  delete window.Visitor
  delete window.__borosTcf
  delete window.__mpi
  delete window.__tcfapi
  delete window.gtag
}

export const stubTcfApi = ({success = true, eventStatus = 'cmpuishown', consents = {}} = {}) => {
  return new Promise(resolve => {
    // mock tcf global api
    window.__tcfapi = (action, tcfApiVersion, handleAction) => {
      resolve(handleAction({eventStatus, purpose: {consents}}, success))
    }
  })
}

export const stubFetch = ({responses = [{urlRe: /^http/, fetchResponse: {}}]} = {}) => {
  const createSuccessResponse = response => {
    const res = new window.Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    })

    return Promise.resolve(res)
  }

  const createFailResponse = () => Promise.reject(new Error('forced error'))

  return sinon.stub(window, 'fetch').callsFake(url => {
    const responseMatch = responses.find(({urlRe}) => urlRe.test(url))
    return responseMatch ? createSuccessResponse(responseMatch.fetchResponse) : createFailResponse()
  })
}

export const stubGoogleAnalytics = () => {
  const savedFields = {
    client_id: 'fakeClientId',
    session_id: 'fakeSessionId'
  }

  window.gtag = (key, id, field, done) => {
    if (key === 'get') {
      return done(savedFields?.[field])
    }

    if (key === 'set') {
      savedFields[id] = field
    }
  }
}

export const stubWindowObjects = ({borosMock = true, borosSuccess = true, isDmpAccepted = true} = {}) => {
  stubTcfApi()

  const _middlewares = []

  function executeMiddlewares(payload, middlewares, done) {
    if (middlewares.length === 0) return done()

    const copyMiddlewares = middlewares.slice()
    const middleware = copyMiddlewares.shift()

    middleware({
      payload,
      integrations: [],
      next: payload => {
        executeMiddlewares(payload, copyMiddlewares, done)
      }
    })
  }

  // Segment Analytics Stub
  window.analytics = {
    // saved locally so it mantains updated values when
    // executing test successively which changes the value
    _testAnonymousId: 'fakeAnonymousId',

    _stubUser: () => {
      if (window.analytics.user) return
      // simulating segments script tag, user is set once the script is loaded
      window.analytics.user = () => ({
        anonymousId: () => window.analytics._testAnonymousId,
        id: () => 'fakeId',
        traits: {email: 'john.wick@continental.net'}
      })
    },

    ready: cb => {
      window.analytics._stubUser()
      cb()
    },
    reset: () => {
      window.analytics._testAnonymousId = 'resetAnonymousId'
    },
    setAnonymousId: id => {
      window.analytics._testAnonymousId = id
    },
    addSourceMiddleware: middleware => {
      _middlewares.push(middleware)
    },
    track: sinon.stub().callsFake((...args) => {
      const [event, properties, context, fn] = args
      const payload = {
        obj: {
          event,
          properties,
          context
        }
      }

      window.analytics._stubUser()

      executeMiddlewares(payload, _middlewares, () => {
        fn(payload)
      })
    }),
    identify: sinon.fake((userId, traits, options, callback) => setTimeout(callback, IDENTIFY_TIMEOUT))
  }

  // Boros TCF Stub

  const mockBorosApi = (_, handle) => handle({success: borosSuccess, value: isDmpAccepted})

  window.__borosTcf = borosMock
    ? {
        push: cb => {
          setTimeout(cb(mockBorosApi), 200)
        }
      }
    : undefined

  const storageMock = (function () {
    let store = {}
    return {
      getItem: key => store[key],
      setItem: function (key, value) {
        store[key] = value.toString()
      },
      removeItem: function (key) {
        store[key] = undefined
      },
      __clear: function () {
        store = {}
      }
    }
  })()

  Object.defineProperty(window, 'localStorage', {
    value: storageMock
  })
}

export const stubDocumentCookie = (value = '') => {
  let cookies = value
  document.__defineGetter__('cookie', () => cookies)
  document.__defineSetter__('cookie', value => (cookies = `${cookies}; ${value}`))
  return {restore: () => (cookies = '')}
}

export const resetReferrerState = () => {
  referrerState.spaReferrer = ''
  referrerState.referrer = ''
}

export const stubActualLocation = location => sinon.stub(referrerUtils, 'getActualLocation').returns(location)

export const stubActualQueryString = queryString =>
  sinon.stub(referrerUtils, 'getActualQueryString').returns(queryString)

export const stubReferrer = (referrer, stubLocation) => {
  const stubDocumentReferrer = sinon.stub(referrerUtils, 'getDocumentReferrer').returns(referrer)

  return {
    restore: () => {
      // we're using stubLocation to reset the state of `internalLocation` variable
      stubLocation.returns('')
      // we update the page referrer with an empty referrer to put all to an internal state
      resetReferrerState()
      updatePageReferrer()
      stubDocumentReferrer.restore()
    }
  }
}
