/* eslint-disable react/prop-types */

import {useEffect} from 'react'
import {Meta} from 'react-head'

export const BODY_ATTRIBUTES_KEY = 'bodyattributes'
const isClient = typeof window !== 'undefined'

interface BodyProps {
  attributes: object
}

const Body: React.FC<BodyProps> = ({attributes = {}}) => {
  useEffect(() => {
    const {body} = document

    function toggleBodyAttributes({action = 'set'} = {}): void {
      const method = `${action}Attribute`
      Object.entries(attributes).forEach(([key, value]) => body[method](key, value))
    }

    toggleBodyAttributes()
    return () => {
      toggleBodyAttributes({action: 'remove'})
    }
  }, [attributes])

  if (isClient) return null
  // on the server, use the Meta tag to extract later
  const metaProps = {...attributes, name: BODY_ATTRIBUTES_KEY}
  return <Meta {...metaProps} />
}

export default Body
