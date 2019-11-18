import React from 'react'

import IndexRoute from '../IndexRoute'
import Redirect from '../Redirect'
import {UUIDGenerator} from './uuid'

export const fromReactTreeToJSON = (root, id = 1) => {
  if (!React.isValidElement(root)) {
    return null
  }

  const {component, path, children, getComponent, from, to} = root.props
  const {type} = root
  return {
    __ID_REF__: UUIDGenerator(),
    ...(type.displayName === Redirect.displayName && {
      redirect: true,
      from,
      to
    }),
    ...(type.displayName === IndexRoute.displayName && {index: true}),
    ...(component && {component}),
    ...(path && {path}),
    ...(getComponent && {getComponent}),
    ...(children && {
      children: React.Children.toArray(children).map(node =>
        fromReactTreeToJSON(node, id + 1)
      )
    })
  }
}
