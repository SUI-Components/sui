/* eslint react/prop-types: 0 */
import React, {createElement, Fragment, useContext} from 'react'
import cx from 'classnames'

import Context from './context'

export const MODES = {
  LIGHT: 'light',
  DARK: 'dark'
}

export const TEXT_TRANSFORM = {
  CAPITALIZE: 'capitalize',
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase'
}

export const FONT_WEIGHT = {
  THIN: 'thin',
  LIGHTER: 'lighter',
  LIGHT: 'light',
  REGULAR: 'regular',
  MEDIUM: 'medium',
  SEMIBOLD: 'semi-bold',
  BOLD: 'bold',
  BLACK: 'black'
}

export const TEXT_DECORATION = {
  UNDERSCORE: 'underscore',
  OVERSCORE: 'overscore',
  UNDERLINE: 'underline',
  OVERLINE: 'overline',
  LINETHROUGH: 'line-through'
}

export const ConditionalProvider = ({
  children,
  content,
  elementType,
  needsProvider,
  mode,
  ...otherProps
}) => {
  const contextProps = useContext(Context) || {}
  if (!needsProvider) {
    return children({
      ...otherProps,
      ...contextProps,
      elementType,
      children: content
    })
  }
  return (
    <Context.Provider value={{mode}}>
      {children({...otherProps, mode, elementType, children: content})}
    </Context.Provider>
  )
}

export const withConditionalProvider = Component => {
  const Base = ({...otherProps} = {}) => {
    const needsProvider =
      Object.keys(otherProps).includes('mode') &&
      Object.entries(MODES)
        .flat()
        .includes(otherProps.mode)
    return (
      <ConditionalProvider
        {...otherProps}
        content={otherProps.children}
        needsProvider={needsProvider}
      >
        {Component}
      </ConditionalProvider>
    )
  }
  return Base
}

export const transformProps = (
  {
    deprecated,
    elementType,
    children,
    fontWeight,
    fullWidth,
    mode,
    textDecoration,
    textTransform,
    className,
    ...props
  } = {},
  displayName
) => {
  const prefix = displayName ? `-${displayName}` : ''
  return {
    ...props,
    className: cx(
      `sui-studio-doc${prefix}`,
      {
        [`sui-studio-doc${prefix}-tt-${textTransform}`]: Object.entries(
          TEXT_TRANSFORM
        )
          .flat()
          .includes(textTransform),
        [`sui-studio-doc${prefix}-fw-${fontWeight}`]: Object.entries(
          FONT_WEIGHT
        )
          .flat()
          .includes(fontWeight),
        [`sui-studio-doc${prefix}-td-${textDecoration}`]: Object.entries(
          TEXT_DECORATION
        )
          .flat()
          .includes(textDecoration),
        [`sui-studio-doc${prefix}-deprecated`]: deprecated,
        [`sui-studio-doc${prefix}-full-width`]: fullWidth,
        [`sui-studio-doc${prefix}-mode-${mode}`]: Object.entries(MODES)
          .flat()
          .includes(mode)
      },
      className
    )
  }
}

const Base = ({children, elementType, ...otherProps}) => {
  const ownProps = Object.assign({}, transformProps(otherProps))
  let ownElementType = elementType
  if (
    (elementType === null ||
      elementType === undefined ||
      elementType === Fragment) &&
    ownProps.className === transformProps().className
  ) {
    delete ownProps.className
    return <Fragment {...ownProps}>children</Fragment>
  } else if (
    ownProps.className !== transformProps().className &&
    (elementType === undefined ||
      elementType === null ||
      elementType === Fragment)
  ) {
    ownElementType = 'span'
  }
  return createElement(ownElementType, {...ownProps}, children)
}

const BaseConditionalProvided = withConditionalProvider(Base)
BaseConditionalProvided.displayName = 'Base'
BaseConditionalProvided.propTypes = {}
BaseConditionalProvided.defaultProps = {}

export default BaseConditionalProvided
