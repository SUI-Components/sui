import {createHash} from '@s-ui/js/lib/hash'
import isNode from '../../../helpers/isNode'

const VERSION_NAMESPACE_TAG =
  isNode && global.USE_VERSION_NAMESPACE_FOR_REDIS_SUI_DECORATORS_CACHE
    ? `${global.USE_VERSION_NAMESPACE_FOR_REDIS_SUI_DECORATORS_CACHE}::`
    : ''

export const inRedis =
  (target, cache, original, fnName, instance, ttl, cacheKey) =>
  async (...args) => {
    const key = `${VERSION_NAMESPACE_TAG}${createHash(JSON.stringify(args))}`
    const cacheItem = await cache.get(key)
    let response

    if (!cacheItem) {
      try {
        response = await original.apply(instance, args)
      } catch (err) {
        console.error(
          `[sui-decorators/cache]:inRedis Error getting original promise response for key(${cacheKey}): ${key}.`,
          err
        )
        return err
      }

      const isInlineErrorResponseWithoutError =
        Array.isArray(response) && response.__INLINE_ERROR__ && response[0] === null && response[1]
      const isNormalResponseWithoutError = response && !response.__INLINE_ERROR__

      if (isInlineErrorResponseWithoutError || isNormalResponseWithoutError) {
        cache.set(key, response, ttl)
      }
    } else {
      return cacheItem
    }

    return response
  }
