import React, {cloneElement} from 'react'
import cx from 'classnames'

import Typography from '../Typography'

export const HEADING_ELEMENT = {
  h1: {
    elementType: 'h1',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-heading',
        'sui-studio-doc-heading-h1',
        {
          [`sui-studio-doc-heading-mode-${mode}`]: mode
        },
        cn
      )
  },
  h2: {
    elementType: 'h2',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-heading',
        'sui-studio-doc-heading-h2',
        {
          [`sui-studio-doc-heading-mode-${mode}`]: mode
        },
        cn
      )
  },
  h3: {
    elementType: 'h3',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-heading',
        'sui-studio-doc-heading-h3',
        {
          [`sui-studio-doc-heading-mode-${mode}`]: mode
        },
        cn
      )
  },
  h4: {
    elementType: 'h4',
    className: (cn, mode) =>
      cx(
        'sui-studio-doc-heading',
        'sui-studio-doc-heading-h4',
        {
          [`sui-studio-doc-heading-mode-${mode}`]: mode
        },
        cn
      )
  }
}

const Heading = ({elementType, children, ...props}) => (
  <Typography {...props} elementType={elementType}>
    {children}
  </Typography>
)

Heading.displayName = 'Heading'

Heading.H1 = ({
  children,
  className,
  elementType = HEADING_ELEMENT.h1.elementType,
  mode,
  ...props
}) => (
  <Heading
    {...props}
    className={HEADING_ELEMENT.h1.className(className, mode)}
    elementType={elementType}
    mode={mode}
  >
    {children}
  </Heading>
)
Heading.H1.displayName = 'H1'

Heading.H2 = ({
  children,
  className,
  elementType = HEADING_ELEMENT.h2.elementType,
  mode,
  ...props
}) => (
  <Heading
    {...props}
    className={HEADING_ELEMENT.h2.className(className, mode)}
    elementType={elementType}
    mode={mode}
  >
    {children}
  </Heading>
)
Heading.H2.displayName = 'H2'

Heading.H3 = ({
  children,
  className,
  elementType = HEADING_ELEMENT.h3.elementType,
  mode,
  ...props
}) => (
  <Heading
    {...props}
    className={HEADING_ELEMENT.h3.className(className, mode)}
    elementType={elementType}
    mode={mode}
  >
    {children}
  </Heading>
)

Heading.H3.displayName = 'H3'

Heading.H4 = ({
  children,
  className,
  elementType = HEADING_ELEMENT.h4.elementType,
  mode,
  ...props
}) => (
  <Heading
    {...props}
    className={HEADING_ELEMENT.h4.className(className, mode)}
    elementType={elementType}
    mode={mode}
  >
    {children}
  </Heading>
)

Heading.H4.displayName = 'H4'

export default Heading
