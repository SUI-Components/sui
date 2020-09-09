/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Paragraph = ({
  children,
  className,
  elementType = 'p',
  mode,
  ...props
}) => (
  <Base
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
  </Base>
)
Paragraph.displayName = 'Paragraph'

export default Paragraph
