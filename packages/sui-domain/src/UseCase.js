export default class UseCase {
  execute() {
    throw new Error('[UseCase#execute] must be implemented')
  }
}
