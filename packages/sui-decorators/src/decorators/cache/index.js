import isNode from '../../helpers/isNode'
import stringOrIntToMs from '../../helpers/stringOrIntToMs'

import {inMemory} from './handlers/inMemory'
import {inRedis} from './handlers/inRedis'

import LRU from './algorithms/LRU'
import RedisLRU from './algorithms/Redis'

const ALGORITHMS = {LRU: 'lru'}
const DEFAULT_TTL = 500

const caches = {}

const _cache = ({
  algorithm,
  fnName,
  instance,
  original,
  size,
  target,
  ttl,
  redis
} = {}) => {
  const cacheKey = `${target.constructor.name}::${fnName}`

  let cache = caches[cacheKey]

  if (!cache) {
    if (!redis) {
      cache = new LRU({size})
    } else {
      if (!isNode) {
        console.warn(
          '[sui-decorators/cache] Your redis config will be ignored in client side. Using the default inMemory LRU strategy.'
        )
        cache = new LRU({size})
      } else {
        cache = new RedisLRU({
          size,
          redisConnection: redis,
          namespace: cacheKey,
          ttl
        })
        console.warn(
          `[sui-decorators/cache] You are using redis cache for cacheKey: ${cacheKey}, your method MUST return a promise`
        )
        return inRedis(target, cache, original, fnName, instance, ttl)
      }
    }
  }

  return inMemory(target, cache, original, fnName, instance, ttl)
}

export default ({
  ttl = DEFAULT_TTL,
  server = false,
  algorithm = ALGORITHMS.LRU,
  size,
  redis
} = {}) => {
  const timeToLife = stringOrIntToMs({ttl}) || DEFAULT_TTL
  return (target, fnName, descriptor) => {
    if (
      (typeof window !== 'undefined' && window.__SUI_CACHE_DISABLED__) ||
      (typeof global !== 'undefined' && global.__SUI_CACHE_DISABLED__)
    ) {
      return descriptor
    }

    // if we're on node but the decorator doesn't have the server flag
    // then we ignore the usage of the decorator and thus the cache
    if (isNode && !server) {
      return descriptor
    }

    if (!isNode && redis) {
      console.warn(
        '[sui-decorators/cache] Your redis config will be ignored in client site. Using the default LRU strategy.'
      )
    }

    const {configurable, enumerable, writable} = descriptor
    const originalGet = descriptor.get
    const originalValue = descriptor.value
    const isGetter = !!originalGet

    // https://github.com/jayphelps/core-decorators.js/blob/master/src/autobind.js
    return Object.assign(
      {},
      {
        configurable,
        enumerable,
        get() {
          const fn = isGetter ? originalGet.call(this) : originalValue
          if (this === target) {
            return fn
          }
          const _fnCached = _cache({
            algorithm,
            fnName,
            instance: this,
            original: fn,
            size,
            target,
            ttl: timeToLife,
            redis
          })

          Object.defineProperty(this, fnName, {
            configurable,
            writable,
            enumerable,
            value: _fnCached
          })
          return _fnCached
        },
        set(newValue) {
          Object.defineProperty(this, fnName, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: newValue
          })

          return newValue
        }
      }
    )
  }
}
