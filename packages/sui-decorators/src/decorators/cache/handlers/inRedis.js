import {createHash} from '@s-ui/js/lib/hash'

const VERSION_NAMESPACE_TAG = global.USE_VERSION_NAMESPACE_FOR_REDIS_SUI_DECORATORS_CACHE
  ? `${global.USE_VERSION_NAMESPACE_FOR_REDIS_SUI_DECORATORS_CACHE}::`
  : ''

export const inRedis = (
  target,
  cache,
  original,
  fnName,
  instance,
  ttl
) => async (...args) => {
  const key = `${VERSION_NAMESPACE_TAG}${createHash(JSON.stringify(args))}`

  const cacheItem = await cache.get(key)
  let response

  if (!cacheItem) {
    try {
      response = await original.apply(instance, args)
    } catch (err) {
      console.error(
        `[sui-decorators/cache]:inRedis Error getting original promise response for key: ${key}`
      )
      return err
    }

    try {
      const isInlineErrorWithoutError =
        response.__INLINE_ERROR__ &&
        Array.isArray(response) &&
        response[0] === null &&
        response[1]
      const noInlineError = response && !response.__INLINE_ERROR__

      if (isInlineErrorWithoutError || noInlineError) {
        cache.set(key, response, ttl)
      }
    } catch (err) {
      console.error(
        `[sui-decorators/cache]:inRedis Error setting cache for key: ${key}. Infra error: ${err.message}`
      )
    }
  } else {
    return cacheItem
  }

  return response
}
