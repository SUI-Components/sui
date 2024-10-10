import bunyan from 'bunyan'
import bunyanMiddleware from 'bunyan-middleware'

import {getDataDogStream} from './DataDogLogger'
import {getStdoutStream} from './StdoutLogger'

const {LOGGER_TO_DATADOG, LOGGER_TO_STDOUT} = process.env

const createLogger = ({appName: name, dataDogOptions = {}, stdoutOptions = {}} = {}) => {
  const isDataDogStreamActive = LOGGER_TO_DATADOG && Boolean(dataDogOptions.routes)

  return bunyan.createLogger({
    name,
    streams: [
      isDataDogStreamActive && {
        type: 'raw',
        stream: getDataDogStream(dataDogOptions)
      },
      LOGGER_TO_STDOUT && {
        type: 'raw',
        stream: getStdoutStream(stdoutOptions)
      }
    ].filter(Boolean)
  })
}

export const getExpressMiddleware = options => bunyanMiddleware({logger: createLogger(options)})
