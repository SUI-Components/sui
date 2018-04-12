import isNode from '../../helpers/isNode'
import {createHash} from '@s-ui/js/lib/hash'
import stringOrIntToMs from '../../helpers/stringOrIntToMs'

import LRU from './algorithms/LRU'
import LFU from './algorithms/LFU'

import Tracker from './tracker'

const DEFAULT_TTL = 500

const isPromise = obj =>
  typeof obj !== 'undefined' && typeof obj.then === 'function'

let caches = {}

const _cache = ({
  ttl,
  target,
  fnName,
  instance,
  original,
  server,
  algorithm,
  host,
  port,
  segmentation,
  size
} = {}) => {
  caches[fnName] =
    caches[fnName] ||
    (algorithm === 'lru'
      ? new LRU({size})
      : algorithm === 'lfu'
        ? new LFU({size})
        : new Error(`[cv-decorators::cache] unknow algorithm: ${algorithm}`))

  const cache = caches[fnName]
  const tracker = new Tracker({algorithm, host, port, fnName, segmentation})

  return (...args) => {
    const key = `${target.constructor.name}::${fnName}::${createHash(
      JSON.stringify(args)
    )}`
    const now = Date.now()
    if (cache.get(key) === undefined) {
      tracker._updateStats({action: Tracker.ACTION_MISSING})
      cache.set(key, {createdAt: now, returns: original.apply(instance, args)})
    } else {
      tracker._updateStats({action: Tracker.ACTION_HIT})
    }

    tracker.track()

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
  algorithm = 'lru',
  trackTo: host,
  port,
  segmentation,
  size
} = {}) => {
  const timeToLife = stringOrIntToMs({ttl}) || DEFAULT_TTL
  return (target, fnName, descriptor) => {
    const {value: fn, configurable, enumerable} = descriptor

    if (isNode && !server) {
      return descriptor
    }

    // https://github.com/jayphelps/core-decorators.js/blob/master/src/autobind.js
    return Object.assign(
      {},
      {
        configurable,
        enumerable,
        get () {
          if (this === target) {
            return fn
          }
          const _fnCached = _cache({
            ttl: timeToLife,
            target,
            fnName,
            instance: this,
            original: fn,
            server,
            algorithm,
            host,
            port,
            segmentation,
            size
          })

          Object.defineProperty(this, fnName, {
            configurable: true,
            writable: true,
            enumerable: false,
            value: _fnCached
          })
          return _fnCached
        },
        set (newValue) {
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
