import {useEffect} from 'react'
import PropTypes from 'prop-types'
import {Meta} from 'react-head'

export const BODY_ATTRIBUTES_KEY = 'bodyattributes'
const isClient = typeof window !== 'undefined'

export default function Body({attributes = {}}) {
  useEffect(
    function() {
      const {body} = document
      function toggleBodyAttributes({action = 'set'} = {}) {
        const method = `${action}Attribute`
        Object.entries(attributes).forEach(([key, value]) =>
          body[method](key, value)
        )
      }

      toggleBodyAttributes()
      return () => toggleBodyAttributes({action: 'remove'})
    },
    [attributes]
  )

  if (isClient) return null
  // on the server, use the Meta tag to extract later
  const metaProps = {...attributes, name: BODY_ATTRIBUTES_KEY}
  return <Meta {...metaProps} />
}

Body.propTypes = {
  attributes: PropTypes.object
}
