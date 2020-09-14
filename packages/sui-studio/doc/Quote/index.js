/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Quote = ({children, className, elementType = 'q', ...props}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx('sui-studio-doc-quote', className)}
  >
    {children}
  </Base>
)

Quote.displayName = 'Quote'

export default Quote
