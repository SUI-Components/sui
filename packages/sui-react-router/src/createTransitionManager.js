import {Tree} from './utils/Tree'
import _isActive from './utils/isActive'
import {matchPattern} from './PatternUtils'
import warning from './routerWarning'
import createMemoryHistory from './createMemoryHistory'

const checkIntegrity = nodes =>
  !nodes.some((node, index) => node.level !== index + 1)

const createParams = ({paramValues, paramNames}) =>
  paramNames.reduce((acc, name, index) => {
    return {...acc, [name]: paramValues[index]}
  }, {})

const findRedirect = nodes => {
  const tail = nodes[nodes.length - 1]
  if (tail.redirect) {
    return tail
  }
  return null
}

const createComponents = async ({nodes, routeInfo}) => {
  const makePromise = getComponent =>
    new Promise((resolve, reject) => {
      getComponent(routeInfo, (err, component) => {
        if (err) return reject(err)

        return resolve(component)
      })
    })

  const indexRoute = nodes.findIndex(node => node.fromIndex)
  if (indexRoute !== -1 && indexRoute === nodes.length - 1) {
    nodes = [...nodes, nodes[indexRoute].indexNode]
  }

  const components = await Promise.all(
    nodes
      .filter(node => node.component || node.getComponent)
      .map(node => {
        return node.component
          ? Promise.resolve(node.component)
          : makePromise(node.getComponent)
      })
  )

  return components
}

// From tree to Array
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

  // Tree.tap(tree)

  const match = Tree.reduce(
    (acc, node) => {
      let {remainingPathname, paramNames, paramValues} = acc
      const pattern = node.path || ''

      if (acc.isFinished) return acc
      if (node.index) return acc

      acc = {
        ...acc,
        nodes: acc.nodes.filter(n => n.level < node.level)
      }

      // console.log(node.level, acc)

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
        acc = {
          ...acc,
          isFinished: checkIntegrity(acc.nodes)
        }
      }

      return acc
    },
    {
      remainingPathname,
      paramNames: [],
      paramValues: [],
      nodes: [],
      isFinished: false
    },
    tree
  )

  const redirectNode = findRedirect(match.nodes)
  if (redirectNode) {
    return {redirectLocation: redirectNode.to}
  }

  const {nodes, paramValues, paramNames} = match
  const params = createParams({paramNames, paramValues})
  const routeInfo = {location, params, routes: nodes}
  const components = await createComponents({nodes, routeInfo})

  return {routeInfo, components}
}

export const createTransitionManager = ({
  history: externalHistory,
  jsonRoutes
}) => {
  const history = externalHistory || createMemoryHistory()
  let state = {
    // components,
    // router,
    // matchContext: {transitionManager, router},
    // location,
    // params,
    // routes
  }

  return {
    async match(location) {
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
    },
    listen(listener) {
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
              warning(
                false,
                'Location "%s" did not match any routes',
                location.pathname + location.search + location.hash
              )
            }

            state = {
              ...state,
              ...routeInfo,
              components,
              location
            }

            return listener(null, state)
          } catch (err) {
            listener(err)
          }
        }
      }

      const unsubscribe = history.listen(historyListener)

      if (state.location) {
        // Picking up on a matchContext.
        listener(null, state)
      } else {
        historyListener(history.getCurrentLocation())
      }

      return unsubscribe
    },
    isActive(location, indexOnly) {
      location = history.createLocation(location)

      return _isActive(
        location,
        indexOnly,
        state.location,
        state.routes,
        state.params
      )
    }
  }
}
