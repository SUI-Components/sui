import React from 'react'

import IndexRoute from '../IndexRoute'
import Redirect from '../Redirect'

export const fromReactTreeToJSON = (root, parent = {}, level = 1) => {
  if (!React.isValidElement(root)) {
    return null
  }

  const {props, type} = root
  const {component, path, children, getComponent, id, from, to} = props
  const {displayName} = type

  const node = Object.create(null)
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
    node.children = React.Children.toArray(children).map(child =>
      fromReactTreeToJSON(child, node, level + 1)
    )

  return node
}
