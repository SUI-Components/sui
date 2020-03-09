import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {Meta} from 'react-head'

export const BODY_ATTRIBUTES_KEY = 'data-bodyattributes'
const isClient = typeof window !== 'undefined'

export default function Body({bodyAttributes = {}}) {
  useEffect(
    function() {
      const {body} = document
      function toggleBodyAttributes({action = 'set'} = {}) {
        const method = `${action}Attribute`
        Object.entries(bodyAttributes).forEach(([key, value]) =>
          body[method](key, value)
        )
      }

      toggleBodyAttributes()
      return () => toggleBodyAttributes({action: 'remove'})
    },
    [bodyAttributes]
  )

  if (isClient) return null
  // on the server, use the Meta tag to extract later
  const metaProps = {...bodyAttributes, [BODY_ATTRIBUTES_KEY]: ''}
  return <Meta {...metaProps} />
}

Body.propTypes = {
  bodyAttributes: PropTypes.object
}
