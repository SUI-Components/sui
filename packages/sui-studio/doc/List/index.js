/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const List = {}

List.Unordered = ({
  children,
  className,
  elementType = 'ul',
  mode,
  ...props
}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-unordered-list',
      {
        [`sui-studio-doc-unordered-list-mode-${mode}`]: mode
      },
      className
    )}
    mode={mode}
  >
    {children}
  </Base>
)
List.Unordered.displayName = 'Unordered'

List.Ordered = ({children, className, elementType = 'ol', mode, ...props}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-ordered-list',
      {
        [`sui-studio-doc-ordered-list-mode-${mode}`]: mode
      },
      className
    )}
    mode={mode}
  >
    {children}
  </Base>
)
List.Ordered.displayName = 'Ordered'

List.Item = ({children, className, elementType = 'li', mode, ...props}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx(
      'sui-studio-doc-list-item',
      {
        [`sui-studio-doc-list-item-mode-${mode}`]: mode
      },
      className
    )}
    mode={mode}
  >
    {children}
  </Base>
)
List.Item.displayName = 'Item'

export default List
