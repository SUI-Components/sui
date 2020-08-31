import React from 'react'
import cx from 'classnames'

import Typography from '../Typography'

const Paragraph = ({
  children,
  className,
  elementType = 'p',
  mode,
  ...props
}) => (
  <Typography
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-paragraph',
      {
        [`sui-studio-doc-paragraph-mode-${mode}`]: mode
      },
      className
    )}
    mode={mode}
  >
    {children}
  </Typography>
)
Paragraph.displayName = 'Paragraph'

export default Paragraph
