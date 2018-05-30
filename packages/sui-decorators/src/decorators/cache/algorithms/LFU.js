import Cache from './Cache'
import Guild from 'guild'

export default class LFU extends Cache {
  constructor({size = 100} = {}) {
    super()
    this._lfu = Guild.cacheWithSize(size)
  }

  get(key) {
    return this._lfu.get(key)
  }
  set(key, value) {
    return this._lfu.put(key, value)
  }
  del(key) {
    this._lfu.remove(key)
  }
}
