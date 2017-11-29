export default class Entity {
  toJSON () {
    throw new Error('[Entity#toJSON] must be implemented')
  }
}
