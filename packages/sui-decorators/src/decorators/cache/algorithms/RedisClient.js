import redis from 'redis'
import redisMock from 'redis-mock'

const useRedis = process.env.USE_REDIS_IN_SUI_DECORATORS_CACHE
let instance

export default class RedisClient {
  constructor({redisConnection}) {
    this._redisClient = useRedis
      ? redis.createClient({
          port: redisConnection.port,
          host: redisConnection.host
        })
      : redisMock.createClient()
    this._redisClient.on('error', err =>
      console.error(
        `[sui-decorators/cache]:RedisClient Error creating client`,
        err
      )
    )
  }

  static getInstance({redisConnection = {host: '127.0.0.1', port: 6379}}) {
    if (!instance) {
      instance = new RedisClient({redisConnection})
    }
    return instance
  }

  get client() {
    return this._redisClient
  }
}
