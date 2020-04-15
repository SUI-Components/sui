// from: https://github.com/ReactTraining/react-router/blob/v3/modules/isActive.js
import {matchPattern} from '../PatternUtils'

/**
 * Check if two objects are deep equal
 * @param {object} a
 * @param {object} b
 * @returns {Boolean} If a and b are deep equal
 */
function deepEqual(a, b) {
  if (a === b) return true

  if (a == null || b == null) return false

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((item, index) => deepEqual(item, b[index]))
    )
  }

  if (typeof a === 'object') {
    for (const p in a) {
      if (!Object.prototype.hasOwnProperty.call(a, p)) {
        continue
      }

      if (a[p] === undefined) {
        if (b[p] !== undefined) {
          return false
        }
      } else if (!Object.prototype.hasOwnProperty.call(b, p)) {
        return false
      } else if (!deepEqual(a[p], b[p])) {
        return false
      }
    }

    return true
  }

  return String(a) === String(b)
}

/**
 * Returns true if the current pathname matches the supplied one, net of
 * leading and trailing slash normalization. This is sufficient for an
 * indexOnly route match.
 * @param {string} pathname Pathname to compare
 * @param {string} currentPathname Current pathname to compare against the previous
 * @returns {Boolean} Return if the pathname provided is active
 */
function pathIsActive(pathname, currentPathname) {
  // Normalize leading slash for consistency. Leading slash on pathname has
  // already been normalized in isActive. See caveat there.
  if (currentPathname.charAt(0) !== '/') {
    currentPathname = `/${currentPathname}`
  }

  // Normalize the end of both path names too. Maybe `/foo/` shouldn't show
  // `/foo` as active, but in this case, we would already have failed the
  // match.
  if (pathname.charAt(pathname.length - 1) !== '/') {
    pathname += '/'
  }

  if (currentPathname.charAt(currentPathname.length - 1) !== '/') {
    currentPathname += '/'
  }

  return currentPathname === pathname
}

/**
 * Returns true if the given pathname matches the active routes and params.
 * @returns {Boolean} Return if the route provided is active
 */
function routeIsActive(pathname, routes, params) {
  let remainingPathname = pathname
  let paramNames = []
  let paramValues = []

  // for...of would work here but it's probably slower post-transpilation.
  for (let i = 0, len = routes.length; i < len; ++i) {
    const route = routes[i]
    const pattern = route.path || ''

    if (pattern.charAt(0) === '/') {
      remainingPathname = pathname
      paramNames = []
      paramValues = []
    }

    if (remainingPathname !== null && pattern) {
      const matched = matchPattern(pattern, remainingPathname)
      if (matched) {
        remainingPathname = matched.remainingPathname
        paramNames = [...paramNames, ...matched.paramNames]
        paramValues = [...paramValues, ...matched.paramValues]
      } else {
        remainingPathname = null
      }

      if (remainingPathname === '') {
        // We have an exact match on the route. Just check that all the params
        // match.
        // FIXME: This doesn't work on repeated params.
        return paramNames.every(
          (paramName, index) =>
            String(paramValues[index]) === String(params[paramName])
        )
      }
    }
  }

  return false
}

/**
 * Returns true if all key/value pairs in the given query are
 * currently active.
 */
function queryIsActive(query, activeQuery) {
  if (activeQuery == null) return query == null
  if (query == null) return true
  return deepEqual(query, activeQuery)
}

/**
 * Check if <Link> with a given pathname/query combination is currently active.
 * @returns {Boolean} Returns true if it matches
 */
export default function isActive(
  {pathname, query},
  indexOnly,
  currentLocation,
  routes,
  params
) {
  if (currentLocation == null) return false

  // TODO: This is a bit ugly. It keeps around support for treating pathnames
  // without preceding slashes as absolute paths, but possibly also works
  // around the same quirks with basenames as in matchRoutes.
  if (pathname.charAt(0) !== '/') {
    pathname = `/${pathname}`
  }

  // FIXME: basecase
  if (pathname === '/') {
    return pathname === currentLocation.pathname
  }

  if (!pathIsActive(pathname, currentLocation.pathname)) {
    // The path check is necessary and sufficient for indexOnly, but otherwise
    // we still need to check the routes.
    if (indexOnly || !routeIsActive(pathname, routes, params)) {
      return false
    }
  }

  return queryIsActive(query, currentLocation.query)
}
