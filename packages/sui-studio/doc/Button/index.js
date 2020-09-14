/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Button = ({
  children,
  elementType = 'button',
  outline,
  className,
  ...props
}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-button',
      {
        'sui-studio-doc-button-outline': outline
      },
      className
    )}
  >
    {children}
  </Base>
)
Button.displayName = 'Button'

Button.Group = ({
  className,
  children,
  elementType = 'div',
  outline,
  ...props
}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-button-group',
      {
        'sui-studio-doc-button-group-outline': outline
      },
      className
    )}
  >
    {children}
  </Base>
)

Button.Group.displayName = 'ButtonGroup'

export default Button
