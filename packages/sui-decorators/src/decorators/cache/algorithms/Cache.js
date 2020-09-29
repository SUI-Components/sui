export default class Cache {
  get() {
    throw new Error('[Cache#get] must be implemented')
  }

  set() {
    throw new Error('[Cache#set] must be implemented')
  }

  del() {
    throw new Error('[Cache#del] must be implemented')
  }

  clear() {
    throw new Error('[Cache#clear] must be implemented')
  }
}
