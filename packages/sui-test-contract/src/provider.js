const path = require('path')
const wrapper = require('@pact-foundation/pact')
const {Pact} = wrapper

const DEFAULT_PORT = 8080
const DEFAULT_LOG_LEVEL = 'INFO'

const pactDir = path.resolve(process.cwd(), 'contract/documents')
const pactLog = path.resolve(process.cwd(), 'contract/logs', 'pact.log')
const defaults = {
  logLevel: DEFAULT_LOG_LEVEL,
  port: Number(process.env.PACT_SERVER_PORT || DEFAULT_PORT)
}

// used to kill any left over mock server instances
process.on('SIGINT', () => {
  wrapper.removeAllServers()
})

const getProvider = ({
  consumer,
  provider,
  logLevel = defaults.logLevel,
  port = defaults.port
}) => {
  return new Pact({
    consumer,
    provider,
    dir: pactDir,
    log: pactLog,
    logLevel,
    port
  })
}

module.exports = {getProvider}
