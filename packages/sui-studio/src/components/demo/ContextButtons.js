import PropTypes from 'prop-types'
import React from 'react'
import Tabs from './Tabs'
import Tab from './Tab'

import {isEmptyObject} from '../utils'

const ContextButtons = ({ctxt, onContextChange, selected}) => {
  if (isEmptyObject(ctxt)) {
    return null
  }

  return (
    <Tabs title="Context">
      {Object.keys(ctxt).map((ctxtType, index) => (
        <Tab
          handleClick={evt => onContextChange(ctxtType, index)}
          isActive={index === selected}
          key={`${ctxtType}${index}`}
          literal={ctxtType}
        />
      ))}
    </Tabs>
  )
}

ContextButtons.displayName = 'ContextButtons'

ContextButtons.propTypes = {
  ctxt: PropTypes.object,
  onContextChange: PropTypes.func,
  selected: PropTypes.number
}

ContextButtons.defaultProps = {
  selected: 0
}
export default ContextButtons
