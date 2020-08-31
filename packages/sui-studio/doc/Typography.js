import React, {createElement} from 'react'
import cx from 'classnames'

export const TEXT_TRANSFORM = {
  capitalize: 'capitalize',
  uppercase: 'uppercase',
  lowercase: 'lowercase'
}

export const FONT_WIDTH = {
  thin: 'thin',
  lighter: 'lighter',
  light: 'light',
  regular: 'regular',
  medium: 'medium',
  semiBold: 'semi-bold',
  bold: 'bold',
  black: 'black'
}

export const TEXT_DECORATION = {
  underscore: 'underscore',
  overscore: 'underscore',
  underline: 'underline',
  overline: 'overline',
  lineThrough: 'line-through'
}

export const MODE = {
  light: 'light',
  dark: 'dark',
}

const Typography = ({
  className,
  children,
  deprecated,
  elementType,
  fontWeight,
  fullWidth,
  mode,
  textTransform,
  textDecoration,
  ...otherProps
}) => {
  return createElement(
    elementType,
    {
      ...otherProps,
      className: cx(
        'sui-studio-doc-typography',
        {
          [`sui-studio-doc-typography-tt-${textTransform}`]: Object.keys(
            TEXT_TRANSFORM
          ).includes(textTransform),
          [`sui-studio-doc-typography-fw-${fontWeight}`]: Object.keys(
            FONT_WIDTH
          ).includes(fontWeight),
          [`sui-studio-doc-typography-td-${textDecoration}`]: Object.keys(
            TEXT_DECORATION
          ).includes(textDecoration),
          [`sui-studio-doc-typography-td-${TEXT_DECORATION.lineThrough}`]: deprecated,
          [`sui-studio-doc-typography-full-width`]: fullWidth,
          [`sui-studio-doc-typography-mode-${mode}`]: mode,
        },
        className
      )
    },
    children
  )
}

export default Typography
