import {ReporterInterface} from './ReporterInterface'

export class ConsoleReporter extends ReporterInterface {
  send({metricName, status, value}) {
    console.log(metricName, status, value) // eslint-disable-line no-console
  }
}
