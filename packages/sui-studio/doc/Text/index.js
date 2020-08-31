import React, {Fragment, Children, isValidElement} from 'react'
import cx from 'classnames'

import Typography from '../Typography'

export const TEXT_ELEMENT = {
  b: {
    elementType: 'b',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-bold',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  },
  strong: {
    elementType: 'strong',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-strong',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  },
  i: {
    elementType: 'i',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-italic',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  },
  em: {
    elementType: 'em',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-emphasized',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  },
  mark: {
    elementType: 'mark',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-marked',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  },
  small: {
    elementType: 'small',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-small',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  },
  del: {
    elementType: 'del',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-deleted',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  },
  ins: {
    elementType: 'ins',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-inserted',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  },
  sub: {
    elementType: 'sub',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-subscript',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  },
  sup: {
    elementType: 'sup',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-text',
        'sui-studio-doc-text-superscript',
        {
          [`sui-studio-doc-text-mode-${mode}`]: mode
        },
        cn
      )
  }
}

const Text = ({elementType = 'span', children, ...props}) => (
  <Typography {...props} elementType={elementType}>
    {children}
  </Typography>
)

Text.displayName = 'Text'

Text.Bold = ({
  children,
  className,
  elementType = TEXT_ELEMENT.b.elementType,
  mode,
  ...props
}) => (
  <Text
    {...props}
    className={TEXT_ELEMENT.b.className(className, mode)}
    elementType={elementType}
    mode={mode}
  >
    {children}
  </Text>
)
Text.Bold.displayName = 'Bold'

Text.Strong = ({
  children,
  className,
  elementType = TEXT_ELEMENT.strong.elementType,
  mode,
  ...props
}) => (
  <Text
    {...props}
    className={TEXT_ELEMENT.strong.className(className, mode)}
    elementType={elementType}
    mode={mode}
  >
    {children}
  </Text>
)
Text.Strong.displayName = 'Strong'

Text.Italic = ({
  children,
  className,
  elementType = TEXT_ELEMENT.i.elementType,
  mode,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.i.className(className, mode)}
    mode={mode}
  >
    {children}
  </Text>
)
Text.Italic.displayName = 'Italic'

Text.Emphasized = ({
  children,
  className,
  elementType = TEXT_ELEMENT.em.elementType,
  mode,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.em.className(className, mode)}
    mode={mode}
  >
    {children}
  </Text>
)
Text.Emphasized.displayName = 'Emphasized'

Text.Mark = ({
  children,
  className,
  elementType = TEXT_ELEMENT.mark.elementType,
  mode,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.mark.className(className, mode)}
    mode={mode}
  >
    {children}
  </Text>
)
Text.Mark.displayName = 'Mark'

Text.Small = ({
  children,
  className,
  elementType = TEXT_ELEMENT.small.elementType,
  mode,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.small.className(className, mode)}
    mode={mode}
  >
    {children}
  </Text>
)
Text.Small.displayName = 'Small'

Text.Deleted = ({
  children,
  className,
  elementType = TEXT_ELEMENT.del.elementType,
  mode,
  ...props
}) => (
  <Text
    {...props}
    elementType={elementType}
    className={TEXT_ELEMENT.del.className(className, mode)}
    mode={mode}
  >
    {children}
  </Text>
)
Text.Deleted.displayName = 'Deleted'

export default Text
