export default class Service {
  execute() {
    throw new Error('[Service#execute] must be implemented')
  }
}
