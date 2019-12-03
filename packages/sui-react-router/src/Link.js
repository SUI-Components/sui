import React, {useCallback, useContext} from 'react'
import cx from 'classnames'
import {
  bool,
  object,
  string,
  func,
  oneOfType,
  shape,
  elementType
} from 'prop-types'
import invariant from 'invariant'

import RRContext from './ReactRouterContext'

const isLeftClickEvent = event => event.button === 0

const isModifiedEvent = event =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const resolveToLocation = (to, router) =>
  typeof to === 'function' ? to(router.location) : to

const isEmptyObject = object => {
  if (!object) {
    return true
  }

  for (const p in object)
    if (Object.prototype.hasOwnProperty.call(object, p)) return false

  return true
}

const Link = ({
  to,
  onClick,
  target,
  activeClassName,
  activeStyle,
  innerRef,
  onlyActiveOnIndex = false,
  ...props
}) => {
  const {router} = useContext(RRContext)
  const handleClick = useCallback(
    event => {
      if (onClick) onClick(event)

      if (event.defaultPrevented) return

      if (isModifiedEvent(event) || !isLeftClickEvent(event)) return

      // If target prop is set (e.g. to "_blank"), let browser handle link.
      if (target) return

      event.preventDefault()

      router.push(resolveToLocation(to, router))
    },
    [onClick, router, target, to]
  )

  if (!router) {
    invariant(
      router,
      '<Link>s rendered outside of a router context cannot navigate.'
    )
    return null
  }

  if (!to) {
    return <a {...props} ref={innerRef} />
  }

  const toLocation = resolveToLocation(to, router)
  props = {...props, href: router.createHref(toLocation)}

  if (activeClassName) {
    props.className = cx(props.className, {
      [activeClassName]: router.isActive(toLocation, onlyActiveOnIndex)
    })
  }

  if (!isEmptyObject(activeStyle))
    props.style = {...props.style, ...activeStyle}

  return <a onClick={handleClick} target={target} ref={innerRef} {...props} />
}

Link.propTypes = {
  to: oneOfType([string, object, func]),
  className: string,
  style: object,
  activeStyle: object,
  activeClassName: string,
  onlyActiveOnIndex: bool.isRequired,
  onClick: func,
  target: string,
  innerRef: oneOfType([string, func, shape({current: elementType})])
}

export default Link
