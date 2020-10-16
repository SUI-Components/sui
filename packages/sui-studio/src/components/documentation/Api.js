import PropTypes from 'prop-types'
import React, {Fragment, useEffect, useState} from 'react'
import {fetchComponentSrcRawFile} from '../tryRequire'

export default function Api({params}) {
  const [docs, setDocs] = useState(null)

  useEffect(() => {
    async function getDocs() {
      const reactDocs = await import('react-docgen')
      const {category, component} = params
      const rawSource = await fetchComponentSrcRawFile({category, component})
      const docs = reactDocs.parse(
        rawSource,
        reactDocs.resolver.findAllComponentDefinitions
      )
      setDocs(docs)
    }
    getDocs()
  }, [params])

  const renderPropsApi = ({props = {}}) => {
    const keysOfProps = Object.keys(props).sort((a, b) => a.localeCompare(b))
    // if the component doesn't have props, show a message
    if (keysOfProps.length === 0) {
      return <p>This component doesn't have props</p>
    }
    // if we have props, render all of them using React
    return keysOfProps.map(propName => {
      const {defaultValue = {}, required, type, description} = props[propName]
      const {value = undefined} = defaultValue

      if (typeof type === 'undefined') {
        console.warn(
          // eslint-disable-line
          'It seem that you might have a prop with a defaultValue but it does not exist as propType'
        )
        return
      }

      return (
        <div className="sui-StudioProps-prop" key={propName}>
          <h3>{propName}</h3>
          <div>
            <div className="sui-StudioProps-tag sui-StudioProps-required">
              <span>required</span>
              <span className={required ? 'is-required' : ''}>
                {required ? 'yes' : 'no'}
              </span>
            </div>
            <div className="sui-StudioProps-tag sui-StudioProps-type">
              <span>type</span>
              <span>{type.name}</span>
            </div>
            {value && (
              <div className="sui-StudioProps-tag sui-StudioProps-default">
                <span>defaultValue</span>
                <span>{value}</span>
              </div>
            )}
          </div>
          {description && <p>{description}</p>}
        </div>
      )
    })
  }

  const renderComponentDoc = (componentDoc, index = 0) => {
    const {props} = componentDoc
    return (
      <Fragment key={index}>
        <h1>{componentDoc.displayName}</h1>
        <h2>Props</h2>
        {renderPropsApi({props})}
      </Fragment>
    )
  }

  if (docs) {
    return Array.isArray(docs)
      ? docs.map(renderComponentDoc)
      : renderComponentDoc(docs)
  }

  return null
}

Api.propTypes = {
  params: PropTypes.shape({
    category: PropTypes.string,
    component: PropTypes.string
  })
}
