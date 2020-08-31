import React from 'react'
import cx from 'classnames'

import Typography from '../Typography'

const range = (length, start = 0) => {
  return Array.from({length}, (_, i) => start + i)
}
const isNumeric = num => !isNaN(num)

const Grid = ({children, className, gutter = 0, cols = 1, style, ...props}) => {
  const [gridRowGap, gridColumnGap] = `${gutter}`.split(',')
  return (
    <div
      {...props}
      style={{
        gridRowGap: isNumeric(gridRowGap) ? `${gridRowGap}px` : gridRowGap,
        gridColumnGap: isNumeric(gridColumnGap)
          ? `${gridColumnGap}px`
          : gridColumnGap,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        ...style
      }}
      className={cx('sui-studio-doc-grid', className)}
    >
      {children}
    </div>
  )
}
Grid.displayName = 'Grid'

Grid.Cell = ({children, className, offset = 0, span = 1, style, ...props}) => {
  return (
    <>
      {range(offset).map(index => (
        <div
          className={cx(
            'sui-studio-doc-grid-cell',
            'sui-studio-doc-grid-cell-offset',
            className
          )}
          style={{gridColumn: 'auto / span 1'}}
          key={index}
        />
      ))}
      <div
        {...props}
        style={{
          gridColumn: `auto / span ${span}`,
          ...style
        }}
        className={cx('sui-studio-doc-grid-cell', className)}
      >
        {children}
      </div>
    </>
  )
}
Grid.Cell.displayName = 'Grid'

export default Grid
