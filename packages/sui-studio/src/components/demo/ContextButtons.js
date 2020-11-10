import PropTypes from 'prop-types'
import Tabs from './Tabs'
import Tab from './Tab'

const ContextButtons = ({ctxt, onContextChange, selected = 0}) => {
  const contextKeys = Object.keys(ctxt)
  if (contextKeys.length === 0) return null

  return (
    <Tabs title="Context">
      {contextKeys.map((ctxtType, index) => (
        <Tab
          handleClick={() => onContextChange(ctxtType, index)}
          isActive={index === selected}
          key={`${ctxtType}${index}`}
          literal={ctxtType}
        />
      ))}
    </Tabs>
  )
}

ContextButtons.propTypes = {
  ctxt: PropTypes.object,
  onContextChange: PropTypes.func,
  selected: PropTypes.number
}

export default ContextButtons
