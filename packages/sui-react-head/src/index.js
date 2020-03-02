import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {Title, HeadProvider, Link, Meta} from 'react-head'
export const SeoProvider = HeadProvider

const BODY_ATTRIBUTES_KEY = 'data-bodyattributes'

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

function Body({bodyAttributes = {}}) {
  useEffect(function() {
    // on the client, set the needed attributes
    if (typeof document !== 'undefined' && document.body) {
      Object.entries(bodyAttributes).forEach(([key, value]) => {
        document.body.setAttribute(key, value)
      })
      return null
    }
  })
  // on the client, set the needed attributes
  if (typeof document !== 'undefined' && document.body) {
    Object.entries(bodyAttributes).forEach(([key, value]) => {
      document.body.setAttribute(key, value)
    })
    return null
  }
  const metaProps = {...bodyAttributes, [BODY_ATTRIBUTES_KEY]: ''}

  // on the server, use the Meta tag to extract later
  return <Meta {...metaProps} />
}

export default function Seo({bodyAttributes, title, meta, link}) {
  return (
    <>
      {title && <Title>{title}</Title>}
      {renderTags({tagsArray: meta, Component: Meta})}
      {renderTags({tagsArray: link, Component: Link})}
      {bodyAttributes && <Body bodyAttributes={bodyAttributes} />}
    </>
  )
}

Body.propTypes = {
  bodyAttributes: PropTypes.object
}

Seo.propTypes = {
  bodyAttributes: PropTypes.object,
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
