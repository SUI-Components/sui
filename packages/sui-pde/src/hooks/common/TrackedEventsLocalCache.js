export class TrackedEventsLocalCache {
  #LOCAL_STORAGE_KEY = 'sui-pde:tracked-events-cache'
  #trackedKeys

  constructor() {
    this.#trackedKeys = this.#read() || {}
  }

  #read() {
    return JSON.parse(localStorage.getItem(this.#LOCAL_STORAGE_KEY))
  }

  #update() {
    localStorage.setItem(
      this.#LOCAL_STORAGE_KEY,
      JSON.stringify(this.#trackedKeys)
    )
  }

  includes(key, value) {
    console.log(
      'checking',
      key,
      value,
      this.#trackedKeys[key],
      this.#trackedKeys[key] === value
    )
    return this.#trackedKeys[key] === value
  }

  push(key, value) {
    console.log('pushing', key, value)
    if (this.#trackedKeys[key] === value) return
    this.#trackedKeys[key] = value
    this.#update()
  }
}
