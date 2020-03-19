export class ReporterInterface {
  send() {
    throw new Error('Reporter#Send method must be implemented')
  }
}
