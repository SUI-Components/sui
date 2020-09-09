/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Label = ({children, className, elementType = 'span', mode, ...props}) => (
  <Base
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
  </Base>
)
Label.displayName = 'Label'

export default Label
