import Cache from './Cache'
import RedisClient from './RedisClient'
import lru from 'redis-lru'

export default class Redis extends Cache {
  constructor({
    redisConnection = {host: '127.0.0.1', port: 6379},
    size = 100,
    namespace,
    ttl = 500
  } = {}) {
    super()
    this._ttl = ttl
    this._redisClient = RedisClient.getInstance({redisConnection}).client
    this._lruRedis = lru(this._redisClient, {
      max: size,
      namespace
    })
  }

  _delay(ms) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), ms)
    })
  }

  async get(key) {
    try {
      const resp = await Promise.race([
        this._lruRedis.get(key),
        this._delay(100)
      ])
      return resp
    } catch (err) {
      console.error(
        `[sui-decorators/cache]:Redis Error Getting cache item for key: ${key}.`,
        err.message
      )
      return null
    }
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   * @param {number} maxAge expire time in ms, default = 500ms
   */
  set(key, value, maxAge = this._ttl) {
    const ret = this._lruRedis.set(key, value, maxAge)
    Promise.race([ret, this._delay(100)]).catch(err => {
      console.error(
        `[sui-decorators/cache]:Redis Error Setting cache item for key: ${key}.`,
        err.message
      )
    })
  }

  del(key) {
    try {
      this._lruRedis.del(key)
    } catch (err) {
      console.error(
        `[sui-decorators/cache]:Redis Error deleting cache item for key: ${key}.`,
        err.message
      )
    }
  }

  clear() {
    this._lruRedis.reset()
  }
}
