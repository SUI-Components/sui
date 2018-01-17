import React from 'react'
import PropTypes from 'prop-types'

import withInitialProps from './withInitialProps'
import createClientContextFactoryParams from './createClientContextFactoryParams'

const EMPTY_GET_INITIAL_PROPS = () => Promise.resolve({})

const createUniversalPage = (contextFactory, routeInfo) => ({ default: Page }) => {
  // check if the Page page has a getInitialProps, if not put a resolve with an empty object
  Page.getInitialProps = typeof Page.getInitialProps === 'function'
    ? Page.getInitialProps
    : EMPTY_GET_INITIAL_PROPS
  // check if we're on the client
  if (typeof window !== 'undefined') {
    // check if we have already data for this component on the window
    if (typeof window.__INITIAL_PROPS__ !== 'undefined') {
      // make a copy of the content safely
      const initialProps = { ...window.__INITIAL_PROPS__ }
      // remove the variable of the window before returning the component
      delete window.__INITIAL_PROPS__
      // resolve the promise with the initialProps passed to the client
      return Promise.resolve(props => <Page {...initialProps} {...props} />)
    }
    // create the context to be used as param on the getInitialProps
    // TODO: Maybe this is no needed as we already have created it?
    return contextFactory(createClientContextFactoryParams())
      // now, we have to create the Page to be rendered on the client with all the info
      .then(context => withInitialProps({ context, routeInfo })(Page))
  }
  // we're in the server, so return just the component and pass the initialProps from the context
  const ServerPage = (props, { initialProps = {} }) =>
    <Page {...props} {...initialProps} />
  // recover the initialProps if in the server we have retrieved them
  ServerPage.contextTypes = { initialProps: PropTypes.object }
  // detect if the page has getInitialProps and wrap it with the routeInfo
  // if we don't have any getInitialProps, just use a empty function returning an empty object
  ServerPage.getInitialProps = context => Page.getInitialProps({ context, routeInfo })
  // return the component to be used on the server
  return ServerPage
}

export default (contextFactory, importPage) => (routeInfo, done) => {
  importPage()
    .then(createUniversalPage(contextFactory, routeInfo))
    .then(Page => { done(null, Page) })
}
