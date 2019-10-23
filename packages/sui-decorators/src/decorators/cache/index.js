import {createHash} from '@s-ui/js/lib/hash'

import isNode from '../../helpers/isNode'
import isPromise from '../../helpers/isPromise'
import stringOrIntToMs from '../../helpers/stringOrIntToMs'

import LRU from './algorithms/LRU'

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
  ttl
} = {}) => {
  caches[fnName] =
    caches[fnName] ||
    (algorithm === ALGORITHMS.LRU
      ? new LRU({size})
      : new Error(`[sui-decorators::cache] unknown algorithm: ${algorithm}`))

  const cache = caches[fnName]

  return (...args) => {
    if (
      (typeof window !== 'undefined' && window.__SUI_CACHE_DISABLED__) ||
      (typeof global !== 'undefined' && global.__SUI_CACHE_DISABLED__)
    ) {
      return original.apply(instance, args)
    }

    const key = `${target.constructor.name}::${fnName}::${createHash(
      JSON.stringify(args)
    )}`
    const now = Date.now()
    if (cache.get(key) === undefined) {
      cache.set(key, {createdAt: now, returns: original.apply(instance, args)})
    }

    if (isPromise(cache.get(key).returns)) {
      cache.get(key).returns.catch(() => cache.del(key))
    }

    if (now - cache.get(key).createdAt > ttl) {
      cache.del(key)
    }

    return cache.get(key) !== undefined
      ? cache.get(key).returns
      : original.apply(instance, args)
  }
}

export default ({
  ttl = DEFAULT_TTL,
  server = false,
  algorithm = ALGORITHMS.LRU,
  size
} = {}) => {
  const timeToLife = stringOrIntToMs({ttl}) || DEFAULT_TTL
  return (target, fnName, descriptor) => {
    // if we're on node but the decorator doesn't have the server flag
    // then we ignore the usage of the decorator and thus the cache
    if (isNode && !server) {
      return descriptor
    }

    const {value: fn, configurable, enumerable} = descriptor

    // https://github.com/jayphelps/core-decorators.js/blob/master/src/autobind.js
    return Object.assign(
      {},
      {
        configurable,
        enumerable,
        get() {
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
            ttl: timeToLife
          })

          Object.defineProperty(this, fnName, {
            configurable: true,
            writable: true,
            enumerable: false,
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
