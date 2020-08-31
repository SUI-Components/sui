import React from 'react'
import cx from 'classnames'

import Typography from '../Typography'

const List = {}

List.Unordered = ({
  children,
  className,
  elementType = 'ul',
  mode,
  ...props
}) => (
  <Typography
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
  </Typography>
)
List.Unordered.displayName = 'Unordered'

List.Ordered = ({children, className, elementType = 'ol', mode, ...props}) => (
  <Typography
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
  </Typography>
)
List.Ordered.displayName = 'Ordered'

List.Item = ({children, className, elementType = 'li', mode, ...props}) => (
  <Typography
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
  </Typography>
)
List.Item.displayName = 'Item'

export default List
