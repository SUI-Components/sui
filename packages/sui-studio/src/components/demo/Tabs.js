import PropTypes from 'prop-types'

export default function Tabs({children, title}) {
  return (
    <ul className="sui-StudioTabs sui-StudioTabs--small">
      <li className="sui-StudioTabs-title">{title}</li>
      {children}
    </ul>
  )
}

Tabs.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string
}
