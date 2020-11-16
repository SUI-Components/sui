import PropTypes from 'prop-types'

export default function Documentation({children}) {
  return (
    <div className="sui-StudioDocumentation">
      <div className="sui-StudioDocumentation-content">{children}</div>
    </div>
  )
}

Documentation.propTypes = {
  children: PropTypes.element
}
