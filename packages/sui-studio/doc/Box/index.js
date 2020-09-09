/* eslint react/prop-types: 0 */
import {createElement} from 'react'
import cx from 'classnames'

const Box = ({
  children,
  className,
  elementType = 'div',
  outline,
  mode,
  ...props
}) =>
  createElement(
    elementType,
    {
      ...props,
      className: cx(
        'sui-studio-doc-box',
        {
          [`sui-studio-doc-box-mode-${mode}`]: mode,
          'sui-studio-doc-box-outline': outline
        },
        className
      ),
      mode
    },
    children
  )

Box.displayName = 'Box'

export default Box
