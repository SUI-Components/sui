exports.navigateFallbackDenylist = denylist => {
  if (!denylist) {
    return undefined
  }

  return denylist.map(exp => new RegExp(exp))
}

exports.navigateFallback = (fallback, publicPath) => {
  if (!fallback) {
    return undefined
  }
  return publicPath + fallback
}

exports.runtimeCaching = runtime => {
  if (!runtime) {
    return []
  }

  return runtime.map(entry => {
    if (entry.default) {
      return entry
    }
    return Object.assign({}, entry, {urlPattern: new RegExp(entry.urlPattern)})
  })
}
