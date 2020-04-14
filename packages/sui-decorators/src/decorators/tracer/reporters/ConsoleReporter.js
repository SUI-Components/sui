import {ReporterInterface} from './ReporterInterface'

export class ConsoleReporter extends ReporterInterface {
  send({metricName = 'NO_METRIC_NAME_SET', status, value}) {
    console.log(metricName, status, value) // eslint-disable-line no-console
  }
}
