/* eslint-disable react/prop-types */

import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Link} from '@s-ui/react-router'
import {fetchMarkdownFile} from '../tryRequire'
import {FILES} from '../../constants'

const TAB_CLASS = 'sui-StudioTabs-tab'
const LINK_CLASS = 'sui-StudioTabs-link'
const ACTIVE_CLASS = LINK_CLASS + '--active'

const SPALink = ({name, to}) => (
  <Link activeClassName={ACTIVE_CLASS} className={LINK_CLASS} to={to}>
    {name}
  </Link>
)

export default function Workbench({children, params}) {
  const [showUX, setShowUX] = useState(false)
  const {category, component} = params

  const Tab = ({name, path}) => {
    const to = `/workbench/${category}/${component}/${path}`

    return (
      <li className={TAB_CLASS}>
        <SPALink to={to} name={name} />
      </li>
    )
  }

  useEffect(
    function() {
      // check if ux definition files exist to show the button
      fetchMarkdownFile({
        category,
        component,
        file: FILES.UX_DEFINITION
      }).then(content => setShowUX(Boolean(content)))
    },
    [category, component]
  )

  return (
    <div className="sui-StudioWorkbench">
      <nav className="sui-StudioWorkbench-navigation">
        <ul className="sui-StudioTabs">
          <Tab name="Demo" path="demo" />
          <Tab name="Api" path="documentation/api" />
          <Tab name="Readme" path="documentation/readme" />
          <Tab name="Changelog" path="documentation/changelog" />
          {showUX && <Tab name="UX Definition" path="documentation/uxdef" />}
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
