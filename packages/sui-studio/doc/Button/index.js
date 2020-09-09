/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Button = ({
  children,
  elementType = 'button',
  mode,
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
        'sui-studio-doc-button-outline': outline,
        [`sui-studio-doc-button-mode-${mode}`]: mode
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
  mode,
  outline,
  ...props
}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-button-group',
      {
        'sui-studio-doc-button-group-outline': outline,
        [`sui-studio-doc-button-group-mode-${mode}`]: mode
      },
      className
    )}
  >
    {children}
  </Base>
)

Button.Group.displayName = 'ButtonGroup'

export default Button
