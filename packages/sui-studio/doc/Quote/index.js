/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Quote = ({children, className, elementType = 'q', mode, ...props}) => (
  <Base
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
  </Base>
)

Quote.displayName = 'Quote'

export default Quote
