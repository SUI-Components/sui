import React from 'react'
import PropTypes from 'prop-types'
import {Title, HeadProvider, Link, Meta} from 'react-head'
import Body from './Body'
import Html from './Html'

export {HeadProvider, Title, Link, Meta, Html, Body}

/**
 * Extract value in a specific order
 * @param {{ name?: string, hreflang?: string, rel?: string }} tag
 * @return {String}
 */
const extractKeyFromTag = tag => {
  const {name, hreflang, rel} = tag
  return name || hreflang || rel
}

/**
 * Use the correct component to render the tag
 * @param {{ tagsArray: Array, Component: Object }} tagsArray
 * @returns {Array}
 */
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

export default function Head({
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
      {bodyAttributes && <Body attributes={bodyAttributes} />}
      {htmlAttributes && <Html attributes={htmlAttributes} />}
    </>
  )
}

Head.propTypes = {
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
