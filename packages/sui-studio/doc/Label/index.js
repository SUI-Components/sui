import React from 'react'
import cx from 'classnames'

import Typography from '../Typography'

const Label = ({children, className, elementType = 'span', mode, ...props}) => (
  <Typography
    {...props}
    className={cx(
      'sui-studio-doc-label',
      {
        [`sui-studio-doc-label-mode-${mode}`]: mode
      },
      className
    )}
    elementType={elementType}
    mode={mode}
  >
    {children}
  </Typography>
)
Label.displayName = 'Label'

export default Label
