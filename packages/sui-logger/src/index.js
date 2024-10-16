const {NODE_ENV} = process.env
const isServer = typeof window === 'undefined' ? 'true' : 'false'

export {createClientLogger} from './client.js'
export {createServerLogger, logErrorsMiddleware} from './server.js'
export {traceInitialProps} from './traceInitialProps.js'

export const initTracker = ({Reporter, appName, environment, version, tenant, ...config}) => {
  const context = {environment: environment || NODE_ENV, isServer, version, tenant}

  Reporter.start(appName, {
    ...config,
    context
  })
}
