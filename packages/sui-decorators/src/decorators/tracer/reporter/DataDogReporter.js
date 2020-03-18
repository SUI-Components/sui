import {ReporterInterface} from './ReporterInterface'

export class DataDogReporter extends ReporterInterface {
  constructor({client}) {
    super()
    this._client = client
  }

  send({metricName = 'NO_METRIC_NAME_SET', status, value}) {
    // eslint-disable-next-line no-console
    console.log('DataDogReporter.send()', metricName, value)
    const globalTags = {
      methodStatus: status
    }

    this._client.timing(metricName, value, globalTags)
  }
}
