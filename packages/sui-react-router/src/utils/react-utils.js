import React from 'react'

import IndexRoute from '../IndexRoute'
import Redirect from '../Redirect'

export const fromReactTreeToJSON = (root, parent = {}, level = 1) => {
  if (!React.isValidElement(root)) {
    return null
  }

  const {component, path, children, getComponent, id, from, to} = root.props
  const {type} = root

  if (type.displayName === IndexRoute.displayName) {
    if (component) parent.component = component
    if (getComponent) parent.getComponent = getComponent
  }

  const node = Object.create(null)
  if (type.displayName === Redirect.displayName) node.redirect = true
  if (type.displayName === Redirect.displayName) node.from = from
  if (type.displayName === Redirect.displayName) node.path = from
  if (type.displayName === Redirect.displayName) node.to = to
  if (type.displayName === IndexRoute.displayName) node.index = true

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
