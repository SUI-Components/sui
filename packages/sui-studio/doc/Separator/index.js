/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const Separator = ({
  children,
  className,
  elementType = 'span',
  mode,
  ...props
}) => (
  <div
    className={cx(
      'sui-studio-doc-separator',
      {
        [`sui-studio-doc-separator-mode-${mode}`]: mode
      },
      className
    )}
  >
    <hr />
    <Base
      {...props}
      className={cx('sui-studio-doc-separator-content', className)}
      elementType={elementType}
      mode={mode}
    >
      {children}
    </Base>
  </div>
)

Separator.displayName = 'Separator'

export default Separator
