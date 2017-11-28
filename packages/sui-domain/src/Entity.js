export default class UserEntity {
  toJSON () {
    throw new Error('[UserEntity#toJSON] must be implemented')
  }
}
