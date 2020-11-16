import {Children as ReactChildren, isValidElement} from 'react'

import IndexRoute from '../IndexRoute'
import Redirect from '../Redirect'

/**
 * Transform from React Elements tree to a plain json
 * @param {import('react').ComponentType} root
 * @param {Object} parent
 * @param {Number} level
 */
export const fromReactTreeToJSON = (root, parent = {}, level = 1) => {
  // Ignore non-elements. This allows people to more
  // easily inline conditionals in their route config.
  if (!isValidElement(root)) return

  const {props, type} = root
  const {component, path, children, getComponent, id, from, to, regexp} = props
  const {displayName} = type

  const node = Object.create(null)

  // Path over Regexp
  if (!path && regexp) {
    node.regexp = regexp
  }

  if (displayName === Redirect.displayName) {
    node.redirect = true
    node.from = from
    node.path = from
    node.to = to
  }

  if (displayName === IndexRoute.displayName) {
    node.index = true
    parent.fromIndex = true
    parent.indexNode = node
  }

  if (level) node.level = level
  if (id) node.id = id
  if (component) node.component = component
  if (getComponent) node.getComponent = getComponent
  if (path) node.path = path
  if (children)
    node.children = ReactChildren.toArray(children).map(child =>
      fromReactTreeToJSON(child, node, level + 1)
    )

  return node
}
