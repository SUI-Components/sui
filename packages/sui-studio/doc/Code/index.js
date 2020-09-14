/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Code = ({children, className, elementType = 'code', ...props}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx('sui-studio-doc-code', className)}
  >
    {children}
  </Base>
)
Code.displayName = 'Code'

export default Code
