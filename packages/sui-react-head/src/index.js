import {Children as ReactChildren} from 'react'
import PropTypes from 'prop-types'
import {Title, HeadProvider, Link, Meta} from 'react-head'
import Body from './Body'
import Html from './Html'

export {HeadProvider}

/**
 * Extract value in a specific order
 * @param {{ name?: string, hreflang?: string, rel?: string , content?: string}} tag
 * @return {String}
 */
const extractKeyFromTag = tag => {
  const {name, hreflang, rel, content} = tag
  return name || hreflang || rel || content
}

/**
 * Filter children from React by tag type and return an array
 * @param {{ children: Array<React.ReactNode>, byTag: string }} params
 * @returns {Array}
 */
export const filter = ({children, byTag}) => {
  return ReactChildren.toArray(children).filter(child => child.type === byTag)
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

/**
 * Extract specific tags from children
 * @param {{
 *    children: Array<React.ReactNode>,
 *    tag: 'meta' | 'link' | 'title'
 *    fallback: Array
 *  }} params
 * @returns {Array}
 */
const extractTagsFrom = ({children, tag, fallback}) => {
  if (!children) return fallback
  return filter({children, byTag: tag}).map(({props}) => ({...props}))
}

/**
 * Extract title from children
 * @param {{ children: Array<React.ReactNode>, fallback: object }} params
 * @returns {String}
 */
const extractTitleFrom = ({children, fallback}) => {
  if (!children) return fallback
  const [title] = filter({children, byTag: 'title'}).map(({props}) => props)
  return title ? title.children : fallback
}

export default function Head({
  bodyAttributes,
  children,
  htmlAttributes,
  title,
  meta = [],
  link = []
}) {
  const metaTagsToRender = extractTagsFrom({
    children,
    tag: 'meta',
    fallback: meta
  })
  const linkTagsToRender = extractTagsFrom({
    children,
    tag: 'link',
    fallback: link
  })
  // title is a special case, so we have the extract from the array
  // and simplify the fallback as used by the method
  const titleToRender = extractTitleFrom({
    children,
    fallback: title
  })

  return (
    <>
      {titleToRender && <Title>{titleToRender}</Title>}
      {renderTags({tagsArray: metaTagsToRender, Component: Meta})}
      {renderTags({tagsArray: linkTagsToRender, Component: Link})}
      {bodyAttributes && <Body attributes={bodyAttributes} />}
      {htmlAttributes && <Html attributes={htmlAttributes} />}
    </>
  )
}

Head.propTypes = {
  bodyAttributes: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]),
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
