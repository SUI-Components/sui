const removePlugin = name => plugins => {
  const pos = plugins
    .map(p => p.constructor.toString())
    .findIndex(string => string.match(name))
  return [...plugins.slice(0, pos), ...plugins.slice(pos + 1)]
}

const pipe = (...funcs) => arg =>
  funcs.reduce((value, func) => func(value), arg)

module.exports = {removePlugin, pipe}
