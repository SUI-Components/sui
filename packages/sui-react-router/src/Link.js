/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
// from: https://github.com/ReactTraining/react-router/blob/v3/modules/Link.js

import {useCallback} from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'

import invariant from './internal/invariant'
import {useRouter} from './hooks'

/**
 * Check if the event is created with some key being held to know it could be for a some contextual stuff
 * @param {MouseEvent} event Event fired by a mouse on clicking
 * @returns {Boolean} Returns if the event has been modified
 */
const isModifiedEvent = event =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

/**
 * Check if the click is the main one, to avoid the contextual ones
 * @param {MouseEvent} event Event fired by a mouse on clicking
 * @returns {Boolean} Returns if the click is the main one. By default, the left click.
 */
const isMainClickEvent = event => event.button === 0

/**
 * Check if the target provided is one we want to handle within the router
 * @param {String} target Target provided to an anchor
 * @returns {Boolean} Returns true if the target provided should be handled by the router
 */
const isManageableTarget = target => !target || target === '_self'

/**
 * Resolve location detecting if is a function or string
 * @param {function | string} to
 * @param {import('./types').Router} router
 * @returns {String} Location
 */
const resolveToLocation = (to, router) =>
  typeof to === 'function' ? to(router.location) : to

const Link = ({
  activeClassName,
  activeStyle,
  innerRef,
  onClick,
  onlyActiveOnIndex = false,
  target,
  to,
  ...restOfProps
}) => {
  const router = useRouter()

  const handleClick = useCallback(
    event => {
      if (onClick) onClick(event)
      if (
        !event.defaultPrevented && // onClick prevented default
        isMainClickEvent(event) && // Ignore everything but left clicks
        isManageableTarget(target) && // Let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // Ignore clicks with modifier keys
      ) {
        event.preventDefault()
        router.push(resolveToLocation(to, router))
      }
    },
    [onClick, router, target, to]
  )

  // Ignore if rendered outside the context of router
  if (!router) {
    return invariant(
      router,
      '<Link>s rendered outside of a router context cannot navigate.'
    )
  }

  // If user does not specify a `to` prop, return an empty anchor tag
  // but keep some props to be used still
  if (!to) {
    return <a {...restOfProps} onClick={onClick} ref={innerRef} />
  }
  // resolve the location as the `to` prop could be an object
  const toLocation = resolveToLocation(to, router)
  // check if the route where the Link is pointing is the actual one
  const isActiveRoute = router.isActive(toLocation, onlyActiveOnIndex)
  // create className and inline styles depending if the route is active
  // if empty string, we default to `undefined` to avoid empty class attribute
  const className =
    cx(restOfProps.className, isActiveRoute && activeClassName) || undefined
  const style = {...restOfProps.style, ...(isActiveRoute && activeStyle)}

  const anchorProps = {
    ...restOfProps,
    className,
    href: router.createHref(toLocation),
    target,
    style
  }

  return <a {...anchorProps} onClick={handleClick} ref={innerRef} />
}

Link.propTypes = {
  /**
   * The class to give the element when it is active. The default given class is active. This will be joined with the className prop.
   */
  activeClassName: PropTypes.string,
  /**
   * The styles to apply to the element when it is active.
   */
  activeStyle: PropTypes.object,
  /**
   * The class to give the element
   */
  className: PropTypes.string,
  /**
   * Get the underlying ref of the component using React.createRef.
   */
  innerRef: PropTypes.oneOfType([
    PropTypes.shape({current: PropTypes.elementType})
  ]),
  /**
   * Function to execute when the element is clicked
   */
  onClick: PropTypes.func,
  /**
   * Only check if the destination is the actual route if you're in the index
   */
  onlyActiveOnIndex: PropTypes.bool,
  /**
   * Inline style for the element
   */
  style: PropTypes.object,
  /**
   * Target attribute for the anchor rendered
   */
  target: PropTypes.string,
  /**
   * to is the destination where we want this Link to navigate to. It could be:
   *
   * A string representation of the Link location, created by concatenating the location’s pathname, search, and hash properties.
   * An object: {pathname, search, hash, state}
   * A function to which current location is passed as an argument and which should return location representation as a string or as an object
   */
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func])
}

export default Link
