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

  get(key) {
    try {
      return this._lruRedis.get(key)
    } catch (err) {
      console.error(
        `[sui-decorators/cache]:Redis Error getting cache item for key: ${key}.`,
        err
      )
    }
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   * @param {number} maxAge expire time in ms, default = 500ms
   */
  set(key, value, maxAge = this._ttl) {
    try {
      return this._lruRedis.set(key, value, maxAge)
    } catch (err) {
      console.error(
        `[sui-decorators/cache]:Redis Error setting cache item for key: ${key}.`,
        err
      )
    }
  }

  del(key) {
    try {
      this._lruRedis.del(key)
    } catch (err) {
      console.error(
        `[sui-decorators/cache]:Redis Error deleting cache item for key: ${key}.`,
        err
      )
    }
  }
}
