import React, {useContext} from 'react'
import InitialPropsContext from './initialPropsContext'
import withInitialProps from './withInitialProps'
import createClientContextFactoryParams from './createClientContextFactoryParams'

const EMPTY_GET_INITIAL_PROPS = () => Promise.resolve({})

const createUniversalPage = (contextFactory, routeInfo) => ({
  default: Page
}) => {
  // check if the Page page has a getInitialProps, if not put a resolve with an empty object
  Page.getInitialProps =
    typeof Page.getInitialProps === 'function'
      ? Page.getInitialProps
      : EMPTY_GET_INITIAL_PROPS
  // check if we're on the client
  if (typeof window !== 'undefined') {
    // check if we have already data for this component on the window
    if (typeof window.__INITIAL_PROPS__ !== 'undefined') {
      // make a copy of the content safely
      const initialProps = {...window.__INITIAL_PROPS__}
      // remove the variable of the window before returning the component
      window.__INITIAL_PROPS__ = undefined
      // resolve the promise with the initialProps passed to the client
      return Promise.resolve(props => <Page {...initialProps} {...props} />)
    }
    // create the context to be used as param on the getInitialProps
    // TODO: Maybe this is no needed as we already have created it?
    return (
      contextFactory(createClientContextFactoryParams())
        // now, we have to create the Page to be rendered on the client with all the info
        .then(context => withInitialProps({context, routeInfo})(Page))
    )
  }
  // we're in the server: Create a component that gets the initialProps from context
  // this context has been created on the `ssrWithComponentWithInitialProps`
  const ServerPage = props => {
    const {initialProps} = useContext(InitialPropsContext)
    return <Page {...props} {...initialProps} />
  }
  // recover the displayName from the original page
  ServerPage.displayName = Page.displayName
  // detect if the page has getInitialProps and wrap it with the routeInfo
  // if we don't have any getInitialProps, just use a empty function returning an empty object
  ServerPage.getInitialProps = context =>
    Page.getInitialProps({context, routeInfo})
  // return the component to be used on the server
  return ServerPage
}

export default (contextFactory, importPage) => (routeInfo, done) => {
  importPage()
    .then(createUniversalPage(contextFactory, routeInfo))
    .then(Page => {
      done(null, Page)
    })
}
