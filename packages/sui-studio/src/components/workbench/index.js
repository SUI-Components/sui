/* eslint-disable react/prop-types */

import PropTypes from 'prop-types'

import {Link} from '@s-ui/react-router'

const TAB_CLASS = 'sui-StudioTabs-tab'
const LINK_CLASS = 'sui-StudioTabs-link'
const ACTIVE_CLASS = LINK_CLASS + '--active'

const SPALink = ({name, to}) => (
  <Link activeClassName={ACTIVE_CLASS} className={LINK_CLASS} to={to}>
    {name}
  </Link>
)

export default function Workbench({children, params}) {
  const {category, component} = params

  const Tab = ({name, path}) => {
    const to = `/workbench/${category}/${component}/${path}`

    return (
      <li className={TAB_CLASS}>
        <SPALink to={to} name={name} />
      </li>
    )
  }

  return (
    <div className="sui-StudioWorkbench">
      <nav className="sui-StudioWorkbench-navigation">
        <ul className="sui-StudioTabs">
          <Tab name="Demo" path="demo" />
          <Tab name="Api" path="documentation/api" />
          <Tab name="Readme" path="documentation/readme" />
          <Tab name="Changelog" path="documentation/changelog" />
        </ul>
      </nav>
      <div className="sui-StudioWorkbench-content">{children}</div>
    </div>
  )
}

Workbench.propTypes = {
  children: PropTypes.element,
  params: PropTypes.shape({
    category: PropTypes.string,
    component: PropTypes.string
  })
}
