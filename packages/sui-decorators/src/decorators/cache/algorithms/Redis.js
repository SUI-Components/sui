import Cache from './Cache'
import redis from 'redis'
import redisMock from 'redis-mock'
import lru from 'redis-lru'

const useRedis = process.env.USE_REDIS_IN_SUI_DECORATORS_CACHE

export default class Redis extends Cache {
  constructor({
    redisConnection = {host: '127.0.0.1', port: 6379},
    size = 100,
    namespace,
    ttl = 500
  } = {}) {
    super()
    this._ttl = ttl
    this._redisClient = useRedis
      ? redis.createClient({
          port: redisConnection.port,
          host: redisConnection.host
        })
      : redisMock.createClient()
    this._lruRedis = lru(this._redisClient, {
      max: size,
      namespace
    })
  }

  get(key) {
    return this._lruRedis.get(key)
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   * @param {number} maxAge expire time in ms, default = 500ms
   */
  set(key, value, maxAge = this._ttl) {
    return this._lruRedis.set(key, value, maxAge)
  }

  del(key) {
    this._lruRedis.del(key)
  }
}
