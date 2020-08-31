import React from 'react'
import cx from 'classnames'

import Typography from '../Typography'

const Code = ({
  children,
  className,
  elementType = 'code',
  mode,
  ...props
}) => (
  <Typography
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-code',
      {
        [`sui-studio-doc-code-mode-${mode}`]: mode
      },
      className
    )}
    mode={mode}
  >
    {children}
  </Typography>
)
Code.displayName = 'Code'

export default Code
