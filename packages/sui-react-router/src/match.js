import {Tree} from './utils/Tree'
import {fromReactTreeToJSON} from './utils/react-utils'
import {matchPattern} from './utils/PatternUtils'

const checkIntegrity = nodes =>
  !nodes.some((node, index) => node.level !== index + 1)

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

  Tree.tap(tree)

  const matches = Tree.reduce(
    (acc, node) => {
      let {remainingPathname, paramNames, paramValues} = acc
      const pattern = node.path || ''

      if (acc.isFinished) return acc
      if (node.index) return acc

      acc = {
        ...acc,
        components: acc.components.filter(n => n.level < node.level)
      }
      console.log(node.level, acc)

      if (pattern.charAt(0) === '/') {
        remainingPathname = location.pathname
        paramNames = []
        paramValues = []
      }

      if (remainingPathname === '' && pattern === '') {
        return {
          ...acc,
          components: [...acc.components, node]
        }
      }

      const matched = matchPattern(pattern, remainingPathname)
      if (matched) {
        acc = {
          remainingPathname: matched.remainingPathname,
          paramNames: [...paramNames, ...matched.paramNames],
          paramValues: [...paramValues, ...matched.paramValues],
          components: [...acc.components, node]
        }
      }

      if (matched?.remainingPathname === '') {
        acc = {
          ...acc,
          isFinished: checkIntegrity(acc.components)
        }
      }

      return acc
    },
    {
      remainingPathname,
      paramNames: [],
      paramValues: [],
      components: [],
      isFinished: false
    },
    tree
  )

  return matches
}

const match = ({routes, history, location}, cb) => {
  const json = fromReactTreeToJSON(routes)
  location = location
    ? history.createLocation(location)
    : history.getCurrentLocation()

  const matchComponents = matchRoutes(json, location)
  console.log(matchComponents)
}

export default match
