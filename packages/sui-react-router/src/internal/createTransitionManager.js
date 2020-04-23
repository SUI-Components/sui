import {formatPattern, matchPattern} from '../PatternUtils'
import internalIsActive from './isActive'
import {Tree} from './Tree'
import warning from './warning'

const checkIntegrity = nodes =>
  !nodes.some((node, index) => node.level !== index + 1)

const createParams = ({paramValues, paramNames}) =>
  paramNames.reduce((acc, name, index) => {
    return {...acc, [name]: paramValues[index]}
  }, {})

const findRedirect = nodes => {
  const tail = nodes[nodes.length - 1]
  return tail && tail.redirect ? tail : null
}

/**
 * Get a component passing the route info and returning a promise with the result
 * @param {(location: object, callback: Function) => Promise<object>} getComponent Function to retrieve a component async
 * @param {import('../types').RouteInfo} routeInfo
 * @returns {Promise<import('react').ReactElement>}
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

const createReducerRoutesTree = location => (acc, node) => {
  let {remainingPathname, paramNames, paramValues} = acc
  if (acc.isFinished) return acc
  if (node.index) return acc

  const {path: pattern = ''} = node

  acc = {
    ...acc,
    nodes: acc.nodes.filter(n => n.level < node.level)
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
      remainingPathname: matched.remainingPathname,
      paramNames: [...paramNames, ...matched.paramNames],
      paramValues: [...paramValues, ...matched.paramValues],
      nodes: [...acc.nodes, node]
    }
  }

  if (matched?.remainingPathname === '') {
    acc.isFinished = checkIntegrity(acc.nodes)
  }

  return acc
}

/**
 *
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

  const match = Tree.reduce(
    createReducerRoutesTree(location),
    {
      remainingPathname,
      paramNames: [],
      paramValues: [],
      nodes: [],
      isFinished: false
    },
    tree
  )

  const {nodes, paramValues, paramNames} = match
  const params = createParams({paramNames, paramValues})
  // check if we have hit a redirect
  const redirectNode = findRedirect(match.nodes)
  if (redirectNode) {
    return {redirectLocation: formatPattern(redirectNode.to, params)}
  }

  const routeInfo = {location, params, routes: nodes}
  const components = await createComponents({nodes, routeInfo})

  return {routeInfo, components}
}

export const createTransitionManager = ({history, jsonRoutes}) => {
  let state = {}

  const match = async location => {
    location = location
      ? history.createLocation(location)
      : history.getCurrentLocation()

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
          const {redirectLocation, routeInfo, components} = await matchRoutes(
            jsonRoutes,
            location
          )

          if (redirectLocation) {
            return history.replace(redirectLocation)
          }

          if (!components) {
            const url = location.pathname + location.search + location.hash
            warning(false, `Location "${url}" did not match any routes`)
          }

          // call listener with null errors and the nextState
          return listener(null, {
            ...state,
            ...routeInfo,
            components,
            location
          })
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

  // Signature should be (location, indexOnly),
  // but needs to support (path, query, indexOnly)
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
