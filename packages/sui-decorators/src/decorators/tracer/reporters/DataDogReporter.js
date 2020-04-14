import {ReporterInterface} from './ReporterInterface'

export class DataDogReporter extends ReporterInterface {
  constructor({client, siteName}) {
    super()
    this._client = client
    this._siteName = siteName
  }

  send({metricName = 'NO_METRIC_NAME_SET', status, value}) {
    const globalTags = {
      status,
      name: metricName
    }

    const siteNameSubString = `${this._siteName ? `${this._siteName}.` : ''}`

    this._client.timing(
      `frontend.${siteNameSubString}tracer.datadog.reporter`,
      value,
      globalTags
    )
  }
}
