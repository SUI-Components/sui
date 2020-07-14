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
  ttl,
  cacheKey
) => async (...args) => {
  const key = `${VERSION_NAMESPACE_TAG}${createHash(JSON.stringify(args))}`
  const cacheItem = await cache.get(key)
  let response

  if (!cacheItem) {
    console.log(
      `[sui-decorators/cache]:inRedis Miss for key(${cacheKey}): ${key}`
    )
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
      Array.isArray(response) &&
      response.__INLINE_ERROR__ &&
      response[0] === null &&
      response[1]
    const isNormalResponseWithoutError = response && !response.__INLINE_ERROR__

    if (isInlineErrorResponseWithoutError || isNormalResponseWithoutError) {
      cache.set(key, response, ttl)
      console.log(
        `[sui-decorators/cache]:inRedis Add key(${cacheKey}): ${key}. `
      )
    }
  } else {
    console.log(
      `[sui-decorators/cache]:inRedis Hit for key(${cacheKey}): ${key}. `
    )
    return cacheItem
  }

  return response
}
