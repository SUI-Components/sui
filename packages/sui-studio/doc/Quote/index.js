import React from 'react'
import cx from 'classnames'

import Typography from '../Typography'

const Quote = ({children, className, elementType = 'q', mode, ...props}) => (
  <Typography
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-quote',
      {
        [`sui-studio-doc-quote-mode-${mode}`]: mode
      },
      className
    )}
    mode={mode}
  >
    {children}
  </Typography>
)

Quote.displayName = 'Quote'

export default Quote
