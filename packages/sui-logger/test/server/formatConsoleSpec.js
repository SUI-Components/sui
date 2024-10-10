import {expect} from 'chai'

import {formatForConsole} from '../../src/server/utils/format'

const request = {
  headers: {
    http_x_distil_requestid: 'distil',
    'X-Forwarded-For': 'forwarded',
    http_x_amz_cf_id: 'e77d4e109eccdaec9de339321a9bae8b',
    host: 'localhost:3000',
    'user-agent': 'ua',
    referer: 'adevinta.com'
  },
  method: 'GET',
  url: '/',
  'user-agent':
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36'
}

const getTenantService = req => {
  const TENANT_COCHES = 'coches'
  const TENANT_MOTOS = 'motos'

  return req.headers.host.includes(TENANT_MOTOS) ? TENANT_MOTOS : TENANT_COCHES
}

describe('createServerLogger - formatForConsole', () => {
  it('Should format a string argument as message', () => {
    const consoleArguments = ['Test']
    const data = formatForConsole({consoleArguments, req: request})

    const {timestamp, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(rest).to.eql({
      message: 'Test',
      ignoredArguments: 0,
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: undefined,
      uri: '/',
      url: 'http://localhost:3000/',
      user_agent: 'ua'
    })
  })

  it('Should format a number argument as message', () => {
    const consoleArguments = [1]
    const data = formatForConsole({consoleArguments, req: request})

    const {timestamp, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(rest).to.eql({
      message: 1,
      ignoredArguments: 0,
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: undefined,
      uri: '/',
      url: 'http://localhost:3000/',
      user_agent: 'ua'
    })
  })

  it('Should format a boolean argument as message', () => {
    const consoleArguments = [true]
    const data = formatForConsole({consoleArguments, req: request})

    const {timestamp, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(rest).to.eql({
      message: true,
      ignoredArguments: 0,
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: undefined,
      uri: '/',
      url: 'http://localhost:3000/',
      user_agent: 'ua'
    })
  })

  it('Should format an undefined argument as message', () => {
    const consoleArguments = [undefined]
    const data = formatForConsole({consoleArguments, req: request})

    const {timestamp, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(rest).to.eql({
      message: undefined,
      ignoredArguments: 0,
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: undefined,
      uri: '/',
      url: 'http://localhost:3000/',
      user_agent: 'ua'
    })
  })

  it('Should format a null argument as message', () => {
    const consoleArguments = [null]
    const data = formatForConsole({consoleArguments, req: request})

    const {timestamp, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(rest).to.eql({
      message: null,
      ignoredArguments: 0,
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: undefined,
      uri: '/',
      url: 'http://localhost:3000/',
      user_agent: 'ua'
    })
  })

  it('Should format an error argument as message', () => {
    const consoleArguments = [new Error('Test')]
    const data = formatForConsole({consoleArguments, req: request})

    const {timestamp, error, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(error.message).to.be.a('string')
    expect(error.stack).to.be.a('string')
    expect(rest).to.eql({
      message: 'Error',
      ignoredArguments: 0,
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: undefined,
      uri: '/',
      url: 'http://localhost:3000/',
      user_agent: 'ua'
    })
  })

  it('Should format an object argument as message', () => {
    const consoleArguments = [
      {
        message: 'Hello',
        booleanField: true,
        stringField: 'true',
        arrayField: ['true'],
        numberField: 0
      }
    ]
    const data = formatForConsole({consoleArguments, req: request})

    const {timestamp, error, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(rest).to.eql({
      message: 'Hello',
      booleanField: true,
      stringField: 'true',
      arrayField: ['true'],
      numberField: 0,
      ignoredArguments: 0,
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: undefined,
      uri: '/',
      url: 'http://localhost:3000/',
      user_agent: 'ua'
    })
  })

  it('Should format skipping array argument as message', () => {
    const consoleArguments = [['a', 'b']]
    const data = formatForConsole({consoleArguments, req: request})

    const {timestamp, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(rest).to.eql({
      ignoredArguments: 0,
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: undefined,
      uri: '/',
      url: 'http://localhost:3000/',
      user_agent: 'ua'
    })
  })

  it('Should format using only one argument', () => {
    const consoleArguments = ['Test', 'Ignored']
    const data = formatForConsole({consoleArguments, req: request})

    const {timestamp, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(rest).to.eql({
      message: 'Test',
      ignoredArguments: 1, // Skipped arguments
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: undefined,
      uri: '/',
      url: 'http://localhost:3000/',
      user_agent: 'ua'
    })
  })

  it('Should format a string argument with tenant service as message', () => {
    const consoleArguments = ['Test']
    const cochesRequest = {
      ...request,
      headers: {...request.headers, host: 'coches.net'}
    }

    const data = formatForConsole({
      consoleArguments,
      getTenantService,
      req: cochesRequest
    })

    const {timestamp, ...rest} = data

    expect(timestamp).to.be.a('number')
    expect(rest).to.eql({
      message: 'Test',
      ignoredArguments: 0,
      node_env: 'test',
      referer: 'adevinta.com',
      tenant: 'coches',
      uri: '/',
      url: 'http://coches.net/',
      user_agent: 'ua'
    })
  })
})
