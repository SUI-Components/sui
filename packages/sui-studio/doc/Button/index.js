import React from 'react'
import cx from 'classnames'

import Typography from '../Typography'

const Button = ({
  children,
  elementType = 'button',
  mode,
  outline,
  className,
  ...props
}) => (
  <Typography
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-button',
      {
        ['sui-studio-doc-button-outline']: outline,
        [`sui-studio-doc-button-mode-${mode}`]: mode
      },
      className
    )}
  >
    {children}
  </Typography>
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
  <Typography
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-button-group',
      {
        ['sui-studio-doc-button-group-outline']: outline,
        [`sui-studio-doc-button-group-mode-${mode}`]: mode
      },
      className
    )}
  >
    {children}
  </Typography>
)

Button.Group.displayName = 'ButtonGroup'

export default Button
