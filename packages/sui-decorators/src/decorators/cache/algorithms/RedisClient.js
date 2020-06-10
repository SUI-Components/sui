import redis from 'redis'
import redisMock from 'redis-mock'

const useRedis = process.env.USE_REDIS_IN_SUI_DECORATORS_CACHE
let instance

export default class RedisClient {
  constructor({redisConnection}) {
    this._redisClient = useRedis
      ? redis.createClient({
          port: redisConnection.port,
          host: redisConnection.host,
          retry_strategy: function(options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
              // End reconnecting on a specific error and flush all commands with
              // a individual error
              return new Error('The server refused the connection')
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
              // End reconnecting after a specific timeout and flush all commands
              // with a individual error
              return new Error('Retry time exhausted')
            }
            if (options.attempt > 10) {
              // End reconnecting with built in error
              return undefined
            }
            // reconnect after
            return Math.min(options.attempt * 100, 3000)
          }
        })
      : redisMock.createClient()

    !useRedis && console.log('Using Mock Client')

    this._redisClient.on('error', function() {
      console.error(`[sui-decorators/cache]:RedisClient Error creating client`)
    })
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
