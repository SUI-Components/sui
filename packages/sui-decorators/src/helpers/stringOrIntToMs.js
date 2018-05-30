const stringOrIntToMs = ({ttl}) => {
  const RADIX = 10

  if (typeof ttl === 'number') {
    return ttl
  }

  let [unit, amount] = ttl.split(' ')
  try {
    unit = parseInt(unit, RADIX)
  } catch (e) {
    return false
  }

  switch (amount) {
    case 'second':
    case 'seconds':
      return unit * 1000

    case 'minute':
    case 'minutes':
      return unit * 1000 * 60

    case 'hour':
    case 'hours':
      return unit * 1000 * 60 * 60

    default:
      return false
  }
}

export default stringOrIntToMs
