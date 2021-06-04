import { RouteInfo } from '@s-ui/react-router/src/types'
export * as ReactRouterTypes from '@s-ui/react-router/src/types'

export type PageComponentOptions = {
  keepMounted?: boolean,
  renderLoading?: (params: GetInitialPropsClientFunctionParams) => React.ElementType,
  Page?: React.ComponentType
}

export type ClientPageComponent = React.ComponentType
  & PageComponentOptions
  & { getInitialProps: GetInitialPropsFunction }

export type ServerPageComponent = React.ComponentType
  & PageComponentOptions
  & { getInitialProps: GetInitialPropsServerFunction } 

export type GetInitialPropsServerFunction = (context: object,
  req: IncomingMessage.ServerRequest,
  res: IncomingMessage.ClientResponse
) => Promise<object>

export type GetInitialPropsClientFunctionParams = {
  context: object,
  routeInfo: RouteInfo,
  req?: IncomingMessage.ServerRequest,
  res?: IncomingMessage.ClientResponse
}

export type GetInitialPropsFunction =
  (params: GetInitialPropsClientFunctionParams) => Promise<object>

export type DoneImportingPageCallback =
  (err: null, Page: WithInitialPropsComponent) => Promise<void>

export type RenderProps = {
  components: Array<ServerPageComponent>
}

export type WithInitialPropsComponent = {
  (props: RouteInfo & object): JSX.Element | React.ElementType<any> | null;
  Page?: ClientPageComponent;
  displayName?: string;
  getInitialProps?: GetInitialPropsServerFunction
}

export type SsrComponentWithInitialPropsParams = {
  Target: React.ComponentType<any>,
  context: object,
  req: IncomingMessage.ServerRequest,
  res: IncomingMessage.ClientResponse,
  renderProps: RenderProps,
  useStream: boolean
}

declare global {
  interface Window {
    __APP_CONFIG__: any
    __INITIAL_PROPS__: any
  }

  namespace IncomingMessage {
    interface ClientResponse {}
    interface ServerRequest {
      appConfig?: object,
      headers: {
        cookie: string,
        'user-agent': string
      },
      path: string
    }
  }
}