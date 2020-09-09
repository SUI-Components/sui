/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Code = ({children, className, elementType = 'code', mode, ...props}) => (
  <Base
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
  </Base>
)
Code.displayName = 'Code'

export default Code
