/* eslint-disable @typescript-eslint/no-floating-promises */
import {useContext} from 'react'

import InitialPropsContext from './initialPropsContext'
import {type ClientPageComponent, type ReactRouterTypes, type WithInitialPropsComponent} from './types'
import withInitialProps from './withInitialProps'

const EMPTY_GET_INITIAL_PROPS = async (): Promise<object> => ({})

interface Logger {
  error: (message: string, error: Error) => void
}

const createUniversalPage =
  (routeInfo: ReactRouterTypes.RouteInfo, logger?: Logger) =>
  async ({default: Page}: {default: ClientPageComponent}) => {
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
    const ServerPage: WithInitialPropsComponent = (props: object) => {
      const {initialProps} = useContext(InitialPropsContext)
      return <Page {...props} {...initialProps} />
    }

    // recover the displayName from the original page
    ServerPage.displayName = Page.displayName
    // detect if the page has getInitialProps and wrap it with the routeInfo
    // if we don't have any getInitialProps, just use a empty function returning an empty object
    ServerPage.getInitialProps = async (
      context: object,
      req: IncomingMessage.ServerRequest,
      res: IncomingMessage.ClientResponse
    ) => {
      try {
        return await Page.getInitialProps({context, routeInfo, req, res})
      } catch (error) {
        const message = 'Error executing getInitialProps on server'

        logger?.error?.(message, error as Error)

        throw error
      }
    }

    // return the component to be used on the server
    return ServerPage
  }

export default (importPage: () => Promise<any>, logger?: Logger) => async (routeInfo: ReactRouterTypes.RouteInfo) => {
  await importPage()

  return createUniversalPage(routeInfo, logger)
}
