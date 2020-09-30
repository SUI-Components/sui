import Cache from './Cache'
import lru from 'tiny-lru/lib/tiny-lru.es5'

export default class LRU extends Cache {
  constructor({size = 100} = {}) {
    super()
    this._lru = lru(size)
  }

  get(key) {
    return this._lru.get(key)
  }

  set(key, value) {
    return this._lru.set(key, value)
  }

  del(key) {
    this._lru.delete(key)
  }

  clear() {
    this._lru.clear()
  }
}
