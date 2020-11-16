import {formatPattern, matchPattern} from '../PatternUtils'
import internalIsActive from './isActive'
import {Tree} from './Tree'
import warning from './warning'

const INITIAL_MATCH_OBJECT = {
  isFinished: false,
  nodes: [],
  paramNames: [],
  paramValues: []
}

const checkIntegrity = nodes =>
  !nodes.some((node, index) => node.level !== index + 1)

const createParams = ({paramValues, paramNames}) =>
  paramNames.reduce((acc, name, index) => {
    return {...acc, [name]: paramValues[index]}
  }, {})

/**
 * Find if there's a Redirect route
 * @param {Array} nodes Array of nodes to check
 */
const findRedirect = nodes => {
  // get last node
  const tail = nodes[nodes.length - 1]
  // if last node is a redirect, we return it
  return tail && tail.redirect ? tail : null
}

/**
 * Get a component passing the route info and returning a promise with the result
 * @param {(location: object, callback: Function) => Promise<object>} getComponent Function to retrieve a component async
 * @param {import('../types').RouteInfo} routeInfo
 * @returns {Promise<import('react').ComponentType>}
 */
const makePromise = (getComponent, routeInfo) =>
  new Promise((resolve, reject) => {
    getComponent(routeInfo, (err, component) =>
      err ? reject(err) : resolve(component)
    )
  })

const createComponents = ({nodes, routeInfo}) => {
  const indexRoute = nodes.findIndex(node => node.fromIndex)
  if (indexRoute !== -1 && indexRoute === nodes.length - 1) {
    nodes = [...nodes, nodes[indexRoute].indexNode]
  }

  // create an array of promises with all components
  const componentsPromises = nodes
    .filter(node => node.component || node.getComponent)
    .map(({component, getComponent}) => {
      return component
        ? Promise.resolve(component)
        : makePromise(getComponent, routeInfo)
    })
  // return a promise that will resolve when all components are available
  return Promise.all(componentsPromises)
}

/**
 * Create the reducer to transverse the three
 * @param {import('../types').Location} location
 * @returns {(acc: object, node: object) => object}
 */
const createReducerRoutesTree = location => (acc, node) => {
  let {remainingPathname, paramNames, paramValues} = acc
  if (acc.isFinished) return acc
  if (node.index) return acc

  let {path: pattern, regexp} = node
  if (!regexp && !pattern) {
    pattern = ''
  }

  acc = {
    ...acc,
    nodes: acc.nodes.filter(n => n.level < node.level)
  }

  if (regexp) {
    const match = remainingPathname.match(regexp)

    if (match) {
      acc = {
        ...acc,
        remainingPathname: match.input.replace(match[0], ''),
        nodes: [...acc.nodes, node]
      }

      if (match.groups) {
        acc.paramNames = [...paramNames, ...Object.keys(match.groups)]
        acc.paramValues = [...paramNames, ...Object.values(match.groups)]
      }

      if (acc.remainingPathname === '') {
        acc.isFinished = checkIntegrity(acc.nodes)
      }
    }
    return acc
  }

  if (pattern.charAt(0) === '/') {
    remainingPathname = location.pathname
    paramNames = []
    paramValues = []
  }

  if (pattern === '') {
    return {
      ...acc,
      nodes: [...acc.nodes, node]
    }
  }

  const matched = matchPattern(pattern, remainingPathname)

  if (matched) {
    acc = {
      nodes: [...acc.nodes, node],
      paramNames: [...paramNames, ...matched.paramNames],
      paramValues: [...paramValues, ...matched.paramValues],
      remainingPathname: matched.remainingPathname
    }

    if (matched.remainingPathname === '') {
      acc.isFinished = checkIntegrity(acc.nodes)
    }
  }

  return acc
}

/**
 * Reduce the tree and check if the current location is matching the routes keeping in mind the remainingPathname
 * @param {Object} tree
 * @param {import('../types').Location} location
 * @param {String=} remainingPathname
 * @returns {Promise<Object>}
 */
const matchRoutes = async (tree, location, remainingPathname) => {
  if (remainingPathname === undefined) {
    if (location.pathname.charAt(0) !== '/') {
      location = {
        ...location,
        pathname: `/${location.pathname}`
      }
    }
    remainingPathname = location.pathname
  }

  const initialObject = {
    ...INITIAL_MATCH_OBJECT,
    remainingPathname
  }

  const match = Tree.reduce(
    createReducerRoutesTree(location),
    initialObject,
    tree
  )

  const {nodes: nodesFromMatch, paramValues, paramNames} = match
  const params = createParams({paramNames, paramValues})

  // check if we have hit a redirect
  const redirectNode = findRedirect(nodesFromMatch)
  if (redirectNode) {
    return {redirectLocation: formatPattern(redirectNode.to, params)}
  }

  // if it's not a redirect and still there's remainingPathname then is not a match
  const nodes = match.remainingPathname
    ? INITIAL_MATCH_OBJECT.nodes
    : nodesFromMatch

  const routeInfo = {location, params, routes: nodes}
  const components = await createComponents({nodes, routeInfo})

  return {routeInfo, components}
}

export const createTransitionManager = ({history, jsonRoutes}) => {
  /** @type {import('../types').RouterState} */
  let state = {}

  const matchRouteAndUpdateState = async ({location, jsonRoutes}) => {
    const {redirectLocation, routeInfo, components} = await matchRoutes(
      jsonRoutes,
      location
    )

    state = {
      ...state,
      ...routeInfo,
      components,
      location
    }

    return {redirectLocation, routeInfo, components}
  }

  /**
   * Match the current location with the json routes
   * @param {import('../types').Location} location Current location object
   */
  const match = location => {
    location = location
      ? history.createLocation(location)
      : history.getCurrentLocation()

    return matchRouteAndUpdateState({jsonRoutes, location})
  }

  /**
   * This is the API for stateful environments. As the location
   * changes, we update state and call the listener. We can also
   * gracefully handle errors and redirects.
   */
  const listen = listener => {
    const historyListener = async location => {
      if (state.location === location) {
        listener(null, {params: state.params, components: state.components})
      } else {
        try {
          const {
            redirectLocation,
            components
          } = await matchRouteAndUpdateState({jsonRoutes, location})

          if (redirectLocation) {
            return history.replace(redirectLocation)
          }

          if (!components) {
            const url = location.pathname + location.search + location.hash
            warning(false, `Location "${url}" did not match any routes`)
          }

          // call listener with null errors and the nextState
          return listener(null, state)
        } catch (err) {
          listener(err)
        }
      }
    }

    // TODO: Only use a single history listener. Otherwise we'll end up with
    // multiple concurrent calls to match.

    // Set up the history listener first in case the initial match redirects.
    const unsubscribe = history.listen(historyListener)

    if (state.location) {
      listener(null, state) // Picking up on a matchContext
    } else {
      historyListener(history.getCurrentLocation())
    }

    return unsubscribe
  }

  /**
   * Check if current location is the active one using the history
   * @param {import('../types').Location} location
   * @param {Boolean} indexOnly Should we check only on index path?
   * @returns {Boolean}
   */
  const isActive = (location, indexOnly) => {
    location = history.createLocation(location)

    return internalIsActive(
      location,
      indexOnly,
      state.location,
      state.routes,
      state.params
    )
  }

  return {
    match,
    listen,
    isActive
  }
}
