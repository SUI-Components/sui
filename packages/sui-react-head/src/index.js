import React from 'react'
import PropTypes from 'prop-types'
import {Title, HeadProvider, Link, Meta} from 'react-head'
import Body from './Body'
import Html from './Html'

export const SeoProvider = HeadProvider

const extractKeyFromTag = tag => {
  const {name, hreflang, rel} = tag
  return name || hreflang || rel
}

const renderTags = ({tagsArray = [], Component}) =>
  tagsArray.map(tag => {
    const {hreflang: hrefLang, ...restOfTagInfo} = tag
    return (
      <Component
        key={extractKeyFromTag(tag)}
        hrefLang={hrefLang}
        {...restOfTagInfo}
      />
    )
  })

export default function Seo({
  bodyAttributes,
  htmlAttributes,
  title,
  meta,
  link
}) {
  return (
    <>
      {title && <Title>{title}</Title>}
      {renderTags({tagsArray: meta, Component: Meta})}
      {renderTags({tagsArray: link, Component: Link})}
      {bodyAttributes && <Body bodyAttributes={bodyAttributes} />}
      {htmlAttributes && <Html htmlAttributes={htmlAttributes} />}
    </>
  )
}

Seo.propTypes = {
  bodyAttributes: PropTypes.object,
  htmlAttributes: PropTypes.object,
  title: PropTypes.string,
  link: PropTypes.arrayOf(
    PropTypes.shape({
      rel: PropTypes.string,
      href: PropTypes.string,
      hreflang: PropTypes.string
    })
  ),
  meta: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      content: PropTypes.string
    })
  )
}
