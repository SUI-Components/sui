/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Label = ({children, className, elementType = 'span', ...props}) => (
  <Base
    {...props}
    className={cx('sui-studio-doc-label', className)}
    elementType={elementType}
  >
    {children}
  </Base>
)
Label.displayName = 'Label'

export default Label
