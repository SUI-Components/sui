/* global location */
/* eslint react/prop-types: 0 */

import React from 'react'
import cx from 'classnames'

import Base from '../Base'

export const isExternalURL = url => {
  var match = url.match(
    /^([^:/?#]+:)?(?:\/\/([^/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/
  )
  if (
    typeof match[1] === 'string' &&
    match[1].length > 0 &&
    match[1].toLowerCase() !== location.protocol
  )
    return true
  if (
    typeof match[2] === 'string' &&
    match[2].length > 0 &&
    match[2].replace(
      new RegExp(
        ':(' + {'http:': 80, 'https:': 443}[location.protocol] + ')?$'
      ),
      ''
    ) !== location.host
  )
    return true
  return false
}

const Anchor = ({children, className, href, mode, target, ...props}) => {
  const isExternalLink = isExternalURL(href)
  return (
    <Base
      {...props}
      elementType="a"
      className={cx(
        'sui-studio-doc-anchor',
        {[`sui-studio-doc-anchor-mode-${mode}`]: mode},
        className
      )}
      target={target || (isExternalLink ? '_blank' : undefined)}
    >
      {children}
    </Base>
  )
}
Anchor.displayName = 'Anchor'

export default Anchor
