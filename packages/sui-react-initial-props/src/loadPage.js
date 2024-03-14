/* eslint-disable @typescript-eslint/no-floating-promises */
import {useContext} from 'react'

import InitialPropsContext from './initialPropsContext.js'
import withInitialProps from './withInitialProps.js'

const EMPTY_GET_INITIAL_PROPS = async () => ({})

const createUniversalPage =
  routeInfo =>
  async ({default: Page}) => {
    // check if the Page page has a getInitialProps, if not put a resolve with an empty object
    Page.getInitialProps = typeof Page.getInitialProps === 'function' ? Page.getInitialProps : EMPTY_GET_INITIAL_PROPS

    // CLIENT
    if (typeof window !== 'undefined') {
      // let withInitialProps HOC handle client getInitialProps logic
      return Promise.resolve(withInitialProps(Page))
    }
    // SERVER
    // Create a component that gets the initialProps from context
    // this context has been created on the `ssrWithComponentWithInitialProps`
    const ServerPage = props => {
      const {initialProps} = useContext(InitialPropsContext)
      return <Page {...props} {...initialProps} />
    }
    // recover the displayName from the original page
    ServerPage.displayName = Page.displayName
    // detect if the page has getInitialProps and wrap it with the routeInfo
    // if we don't have any getInitialProps, just use a empty function returning an empty object
    ServerPage.getInitialProps = (context, req, res) => Page.getInitialProps({context, routeInfo, req, res})
    // return the component to be used on the server
    return ServerPage
  }

// TODO: Remove this method on next major as it's using unnecessary contextFactory param
// and unnecesary calling done method instead relying on promises
export default (_, importPage) => async (routeInfo, done) => {
  importPage()
    .then(createUniversalPage(routeInfo))
    .then(Page => {
      done(null, Page)
    })
}
