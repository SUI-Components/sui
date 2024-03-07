import {renderToNodeStream, renderToString} from 'react-dom/server'

import InitialPropsContext from './initialPropsContext'
import {type InitialProps, type SsrComponentWithInitialPropsParams} from './types'

const hrTimeToMs = (diff: [number, number]): number => diff[0] * 1e3 + diff[1] * 1e-6

export default async function ssrComponentWithInitialProps({
  Target,
  context,
  req,
  res,
  renderProps,
  useStream = false
}: SsrComponentWithInitialPropsParams): Promise<object> {
  const startGetInitialProps = process.hrtime()
  // use the getInitialProps from the page to retrieve the props to initialize
  const {getInitialProps} = renderProps.components[renderProps.components.length - 1]

  const initialProps: InitialProps = await getInitialProps(context, req, res)
  const diffGetInitialProps = process.hrtime(startGetInitialProps)
  const {__HTTP__: http} = initialProps

  if (http?.redirectTo !== undefined) {
    return {
      initialProps,
      performance: {
        getInitialProps: hrTimeToMs(diffGetInitialProps),
        renderToString: 0
      }
    }
  }

  // Create App with Context with the initialProps
  const AppWithContext = (
    <InitialPropsContext.Provider value={{initialProps}}>
      <Target {...renderProps} initialProps={initialProps} />
    </InitialPropsContext.Provider>
  )
  // use a different action and response key depending if we're using streaming
  const [renderAction, renderResponseKey] = useStream
    ? [renderToNodeStream, 'reactStream']
    : [renderToString, 'reactString']
  // start to calculate renderToString
  const startRenderToString = process.hrtime()
  // render with the needed action
  const renderResponse = {[renderResponseKey]: renderAction(AppWithContext)}
  // calculate the difference of time used rendering
  const diffRenderToString = process.hrtime(startRenderToString)
  // return all the info
  return {
    ...renderResponse,
    initialProps,
    performance: {
      getInitialProps: hrTimeToMs(diffGetInitialProps),
      renderToString: hrTimeToMs(diffRenderToString)
    }
  }
}
