import path from 'path'
import {Pact} from '@pact-foundation/pact'

const DEFAULT_PORT = '8080'
const DEFAULT_LOG_LEVEL = 'INFO'
const pactDir = path.resolve(process.cwd(), 'contract/documents')
const pactLog = path.resolve(process.cwd(), 'contract/logs', 'pact.log')
const defaults = {
  logLevel: DEFAULT_LOG_LEVEL,
  port: Number(process.env.PACT_SERVER_PORT || DEFAULT_PORT)
}

export default ({
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
