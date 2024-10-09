/* eslint-disable camelcase */

const {NODE_ENV} = process.env

const FORMATTED_ARGUMENTS = 1
const STACK_FIRST_LINE = 0
const STACK_LAST_LINE = 3

const getShortenStack = stack => stack.split('\n').slice(STACK_FIRST_LINE, STACK_LAST_LINE).join(' ')

const consoleArgumentMapper = param => {
  // For null and undefined ones
  if (!param) return {message: param}

  if (param instanceof Array) return {}

  if (typeof param === 'object') {
    if ('stack' in param) {
      return {
        message: param.name || 'Error',
        error: {
          message: param.message || '-',
          stack: getShortenStack(param.stack) || '-'
        }
      }
    }

    return param
  }

  // For string, number, boolean, symbol:
  return {message: param}
}

export const getRequestData = ({getTenantService, req}) => {
  return {
    distil_id: req ? req.headers.http_x_distil_requestid : '-',
    forwarded: req ? req.headers['X-Forwarded-For'] : '-',
    http_verb: req ? req.method : '-',
    referer: req ? req.headers.referer : '-',
    uri: req ? req.url : '-',
    url: req ? `http://${req.headers.host}${req.url}` : '-',
    user_agent: req ? req.headers['user-agent'] : '-',
    ...(getTenantService ? {tenant: getTenantService(req)} : {})
  }
}

export const formatForConsole = ({consoleArguments = [], getTenantService, req}) => {
  const hasConsoleArguments = Boolean(consoleArguments.length)
  const firstArgumentLoggedData = consoleArgumentMapper(consoleArguments[0])

  const {referer, tenant, uri, url, user_agent} = getRequestData({getTenantService, req}) // eslint-disable-line

  return {
    ...firstArgumentLoggedData,
    ...(hasConsoleArguments && {
      ignoredArguments: consoleArguments.length - FORMATTED_ARGUMENTS
    }),
    node_env: NODE_ENV || '-',
    referer,
    tenant,
    timestamp: new Date().getTime(),
    uri,
    url,
    user_agent
  }
}
