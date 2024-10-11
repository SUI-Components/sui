/* eslint-disable no-console */
import {formatForConsole} from '../utils/format'

const {DISABLE_SERVER_LOGGER_PATCH} = process.env

const originalConsole = {
  error: console.error,
  info: console.info,
  log: console.log,
  warn: console.warn
}

let ready = false

function handleProcessUnhandledErrors() {
  process.on('unhandledRejection', error => {
    // this throw trigger uncaughtException event
    throw error
  })

  process.on('uncaughtException', error => {
    console.error(error)
  })
}

function patchConsoleMethod({method, req, fields, getTenantService}) {
  console[method] = function () {
    const log = formatForConsole({
      consoleArguments: arguments,
      req,
      getTenantService
    })

    originalConsole[method](
      JSON.stringify({
        ...log,
        ...fields
      })
    )
  }
}

function createServerLogger({req, team, userId, getTenantService} = {}) {
  if (ready || DISABLE_SERVER_LOGGER_PATCH) return originalConsole

  Object.keys(originalConsole).forEach(method => {
    patchConsoleMethod({method, req, fields: {team, userId}, getTenantService})
  })

  handleProcessUnhandledErrors()

  ready = true
  return originalConsole
}
export {createServerLogger}
