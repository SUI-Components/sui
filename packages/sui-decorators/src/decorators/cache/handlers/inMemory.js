import {createHash} from '@s-ui/js/lib/hash'
import isPromise from '../../../helpers/isPromise'

export const inMemory = (target, cache, original, fnName, instance, ttl) => (
  ...args
) => {
  const key = createHash(JSON.stringify(args))
  const now = Date.now()

  if (cache.get(key) === undefined) {
    cache.set(key, {createdAt: now, returns: original.apply(instance, args)})
  }

  if (isPromise(cache.get(key).returns)) {
    cache
      .get(key)
      .returns.then(args => {
        if (args.__INLINE_ERROR__ && Array.isArray(args) && args[0]) {
          cache.del(key)
        }
      })
      .catch(() => cache.del(key))
  }

  if (now - cache.get(key).createdAt > ttl) {
    cache.del(key)
  }

  return cache.get(key) !== undefined
    ? cache.get(key).returns
    : original.apply(instance, args)
}
