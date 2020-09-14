/* eslint react/prop-types: 0 */
import React from 'react'
import cx from 'classnames'

import Base from '../Base'

export const TEXT_ELEMENT = {
  b: {
    elementType: 'b',
    className: cn => cx('sui-studio-doc-text', 'sui-studio-doc-text-bold', cn)
  },
  strong: {
    elementType: 'strong',
    className: cn => cx('sui-studio-doc-text', 'sui-studio-doc-text-strong', cn)
  },
  i: {
    elementType: 'i',
    className: cn => cx('sui-studio-doc-text', 'sui-studio-doc-text-italic', cn)
  },
  em: {
    elementType: 'em',
    className: cn =>
      cx('sui-studio-doc-text', 'sui-studio-doc-text-emphasized', cn)
  },
  mark: {
    elementType: 'mark',
    className: cn => cx('sui-studio-doc-text', 'sui-studio-doc-text-marked', cn)
  },
  small: {
    elementType: 'small',
    className: cn => cx('sui-studio-doc-text', 'sui-studio-doc-text-small', cn)
  },
  del: {
    elementType: 'del',
    className: cn =>
      cx('sui-studio-doc-text', 'sui-studio-doc-text-deleted', cn)
  },
  ins: {
    elementType: 'ins',
    className: cn =>
      cx('sui-studio-doc-text', 'sui-studio-doc-text-inserted', cn)
  },
  sub: {
    elementType: 'sub',
    className: cn =>
      cx('sui-studio-doc-text', 'sui-studio-doc-text-subscript', cn)
  },
  sup: {
    elementType: 'sup',
    className: cn =>
      cx('sui-studio-doc-text', 'sui-studio-doc-text-superscript', cn)
  }
}

const Text = ({elementType = 'span', children, ...props}) => (
  <Base {...props} elementType={elementType}>
    {children}
  </Base>
)

Text.displayName = 'Text'

Text.Bold = ({
  children,
  className,
  elementType = TEXT_ELEMENT.b.elementType,
  ...props
}) => (
  <Text
    {...props}
    className={TEXT_ELEMENT.b.className(className)}
    elementType={elementType}
  >
    {children}
  </Text>
)
Text.Bold.displayName = 'Bold'

Text.Strong = ({
  children,
  className,
  elementType = TEXT_ELEMENT.strong.elementType,
  ...props
}) => (
  <Text
    {...props}
    className={TEXT_ELEMENT.strong.className(className)}
    elementType={elementType}
  >
    {children}
  </Text>
)
Text.Strong.displayName = 'Strong'

Text.Italic = ({
  children,
  className,
  elementType = TEXT_ELEMENT.i.elementType,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.i.className(className)}
  >
    {children}
  </Text>
)
Text.Italic.displayName = 'Italic'

Text.Emphasized = ({
  children,
  className,
  elementType = TEXT_ELEMENT.em.elementType,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.em.className(className)}
  >
    {children}
  </Text>
)
Text.Emphasized.displayName = 'Emphasized'

Text.Mark = ({
  children,
  className,
  elementType = TEXT_ELEMENT.mark.elementType,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.mark.className(className)}
  >
    {children}
  </Text>
)
Text.Mark.displayName = 'Mark'

Text.Small = ({
  children,
  className,
  elementType = TEXT_ELEMENT.small.elementType,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.small.className(className)}
  >
    {children}
  </Text>
)
Text.Small.displayName = 'Small'

Text.Deleted = ({
  children,
  className,
  elementType = TEXT_ELEMENT.del.elementType,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.del.className(className)}
  >
    {children}
  </Text>
)
Text.Deleted.displayName = 'Deleted'

export default Text
