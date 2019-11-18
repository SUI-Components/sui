import {Tree} from './utils/Tree'
import {fromReactTreeToJSON} from './utils/react-utils'
import {matchPattern} from './utils/PatternUtils'

// From tree to Array
const matchRoutes = (tree, location, remainingPathname) => {
  if (remainingPathname === undefined) {
    if (location.pathname.charAt(0) !== '/') {
      location = {
        ...location,
        pathname: `/${location.pathname}`
      }
    }
    remainingPathname = location.pathname
  }

  const matches = Tree.reduce(
    (acc, node) => {
      let {remainingPathname, paramNames, paramValues} = acc
      const pattern = node.path || ''

      if (pattern.charAt(0) === '/') {
        remainingPathname = location.pathname
        paramNames = []
        paramValues = []
      }

      const matched = matchPattern(pattern, remainingPathname)
      if (matched) {
        acc = {
          components: [...acc.components, node],
          remainingPathname: matched.remainingPathname,
          paramNames: [...paramNames, ...matched.paramNames],
          paramValues: [...paramValues, ...matched.paramValues]
        }
      }

      return acc
    },
    {
      remainingPathname,
      paramNames: [],
      paramValues: [],
      components: []
    },
    tree
  )

  return matches
}

const match = ({routes, history, location}, cb) => {
  const json = fromReactTreeToJSON(routes)
  if (location) {
    location = history.createLocation(location)
  } else {
    location = history.getCurrentLocation()
  }

  const matchComponents = matchRoutes(json, location)
  console.log(matchComponents)
}

export default match
