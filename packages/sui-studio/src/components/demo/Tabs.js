import PropTypes from 'prop-types'

export default function Tabs({children, title}) {
  return (
    <ul className="sui-StudioTabs sui-StudioTabs--small">{children}</ul>
  )
}

Tabs.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string
}
