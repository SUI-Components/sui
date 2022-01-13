import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Context from '@s-ui/react-context'

export default function Widget({children, context = {}, isVisible = true}) {
  return (
    isVisible && <Context.Provider value={context}>{children}</Context.Provider>
  )
}

Widget.propTypes = {
  children: PropTypes.element.isRequired,
  context: PropTypes.object,
  isVisible: PropTypes.bool
}
