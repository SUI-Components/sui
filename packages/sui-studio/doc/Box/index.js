/* eslint react/prop-types: 0 */
import {createElement} from 'react'
import cx from 'classnames'

import {withConditionalProvider} from '../Base'

let Box = ({
  children,
  className,
  elementType = 'div',
  outline,
  mode,
  color,
  ...props
}) => {
  const styleColorProps = {}
  if (color) {
    styleColorProps.borderColor = color
    if (!outline) {
      styleColorProps.background = color
    }
  }
  return createElement(
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
      style: {...props.style, ...styleColorProps}
    },
    children
  )
}

Box = withConditionalProvider(Box)
Box.displayName = 'Box'

export default Box
