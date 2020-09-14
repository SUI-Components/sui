/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

const List = {}

List.Unordered = ({children, className, elementType = 'ul', ...props}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx('sui-studio-doc-unordered-list', className)}
  >
    {children}
  </Base>
)
List.Unordered.displayName = 'Unordered'

List.Ordered = ({children, className, elementType = 'ol', ...props}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx('sui-studio-doc-ordered-list', className)}
  >
    {children}
  </Base>
)
List.Ordered.displayName = 'Ordered'

List.Item = ({children, className, elementType = 'li', ...props}) => (
  <Base
    {...props}
    elementType={elementType}
    className={cx('sui-studio-doc-list-item', className)}
  >
    {children}
  </Base>
)
List.Item.displayName = 'Item'

export default List
