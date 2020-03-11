import {renderToString} from 'react-dom/server'
import {BODY_ATTRIBUTES_KEY} from './Body'
import {HTML_ATTRIBUTES_KEY} from './Html'

/**
 * Extract props from a list of tags a specific tag by using a key
 * and then discard this key before returning the key
 * @param {Array} tags
 * @param {{ withKey: String }} options
 * @returns {Object}
 */
const extractPropsFrom = (tags, {withKey}) => {
  // search the tag using the key and default to an empty object for simplicity
  const {props} = tags.find(({props}) => props.name === withKey) || {}

  if (props) {
    // discard the key used to search the tag
    const {name, ...restOfTag} = props
    // return only the desired info for the tag
    return restOfTag
  }
}

/**
 * Transform the object from the head to a string to be used in the server
 * @param {{ [key: string]: string }} headObject
 * @returns {String}
 */
const transformToString = (headObject = {}) =>
  Object.entries(headObject)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

/**
 * Render the tags for the head
 * @param {Array} headTags
 * @returns {{ headString: String, bodyAttributes: String, htmlAttributes: String}}
 */
export function renderHeadTagsToString(headTags) {
  const bodyAttributesProps = extractPropsFrom(headTags, {
    withKey: BODY_ATTRIBUTES_KEY
  })
  const htmlAttributesProps = extractPropsFrom(headTags, {
    withKey: HTML_ATTRIBUTES_KEY
  })

  const headTagsToRender = headTags.filter(
    ({props}) =>
      props.name !== BODY_ATTRIBUTES_KEY && props.name !== HTML_ATTRIBUTES_KEY
  )

  return {
    headString: renderToString(headTagsToRender),
    bodyAttributes: transformToString(bodyAttributesProps),
    htmlAttributes: transformToString(htmlAttributesProps)
  }
}
