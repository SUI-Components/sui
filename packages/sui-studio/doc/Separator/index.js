/* eslint react/prop-types: 0 */
import React, {useContext} from 'react'
import cx from 'classnames'

import Context from '../context'
import Base, {MODES} from '../Base'

const Separator = ({
  children,
  className,
  elementType = 'span',
  mode,
  ...props
}) => {
  const contextProps = useContext(Context) || {}
  const ownMode = mode || contextProps.mode
  return (
    <div
      className={cx(
        'sui-studio-doc-separator',
        {
          [`sui-studio-doc-separator-mode-${ownMode}`]: ownMode
        },
        className
      )}
    >
      <hr />
      <Base
        {...props}
        className={cx('sui-studio-doc-separator-content', className)}
        elementType={elementType}
        {...{
          ...contextProps,
          mode: ownMode === MODES.LIGHT ? MODES.DARK : MODES.LIGHT
        }}
      >
        {children}
      </Base>
    </div>
  )
}

Separator.displayName = 'Separator'

export default Separator
