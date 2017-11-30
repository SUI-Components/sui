export default class ValueObject {
  toJSON () {
    throw new Error('[ValueObject#toJSON] must be implemented')
  }
}
