export default queryString => {
  if (queryString.indexOf('?') > -1) {
    queryString = queryString.split('?')[1]
  }
  const pairs = queryString.split('&')
  const result = {}
  pairs.forEach(function (pair) {
    pair = pair.split('=')
    result[pair[0]] = decodeURIComponent(pair[1] || '')
  })
  return result
}
