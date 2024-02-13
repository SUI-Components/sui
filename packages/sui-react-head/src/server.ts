import {renderToString} from 'react-dom/server'

import {BODY_ATTRIBUTES_KEY} from './Body'
import {HTML_ATTRIBUTES_KEY} from './Html'
import {type ComponentTag} from './types'

interface ExtractPropsFromConfig {
  withKey: string
}

/**
 * Extract props from a list of tags a specific tag by using a key
 * and then discard this key before returning the key
 */
const extractPropsFrom = (tags: ComponentTag[], {withKey}: ExtractPropsFromConfig): undefined | Record<string, any> => {
  // search the tag using the key and default to an empty object for simplicity
  const tag: ComponentTag | undefined = tags.find(({props}) => props.name === withKey)

  if (tag != null) {
    // discard the key used to search the tag
    const {name, ...restOfTag} = tag.props
    // return only the desired info for the tag
    return restOfTag
  }
}

/**
 * Transform the object from the head to a string to be used in the server
 */
const transformToString = (headObject: Record<string, string> = {}): string =>
  Object.entries(headObject)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

/**
 * Render the tags for the head
 */
export function renderHeadTagsToString(headTags: ComponentTag[]): {
  headString: string
  bodyAttributes: string
  htmlAttributes: string
} {
  const bodyAttributesProps = extractPropsFrom(headTags, {
    withKey: BODY_ATTRIBUTES_KEY
  })
  const htmlAttributesProps = extractPropsFrom(headTags, {
    withKey: HTML_ATTRIBUTES_KEY
  })

  const headTagsToRender = headTags.filter(
    ({props}) => props.name !== BODY_ATTRIBUTES_KEY && props.name !== HTML_ATTRIBUTES_KEY
  )

  return {
    headString: renderToString(headTagsToRender),
    bodyAttributes: transformToString(bodyAttributesProps),
    htmlAttributes: transformToString(htmlAttributesProps)
  }
}
