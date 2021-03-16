import PropTypes from 'prop-types'

export default function Widgets({children}) {
  return <div key={Math.random()}>{children}</div>
}

Widgets.propTypes = {children: PropTypes.node}
