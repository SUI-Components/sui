import PropTypes from 'prop-types'
import {useLocation} from '@s-ui/react-router'
import Tabs from './Tabs'
import Tab from './Tab'

const ContextButtons = ({ctxt, onContextChange}) => {
  const contextKeys = Object.keys(ctxt)
  const {
    query: {actualContext = 'default'}
  } = useLocation()

  if (contextKeys.length === 0) return null

  return (
    <Tabs title="Context">
      {contextKeys.map((ctxtType, index) => (
        <Tab
          handleClick={() => onContextChange(ctxtType)}
          isActive={actualContext === ctxtType}
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
