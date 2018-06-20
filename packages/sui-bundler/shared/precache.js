const ALL = '::all::'

exports.directoryIndex = whitelist => {
  return whitelist ? undefined : false
}

exports.navigateFallbackWhitelist = whitelist => {
  if (!whitelist || whitelist[0] === ALL) {
    return []
  }
  return whitelist.map(exp => new RegExp(exp))
}

exports.navigateFallback = whitelist => {
  if (!whitelist) {
    return ''
  }
  return 'index.html'
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
