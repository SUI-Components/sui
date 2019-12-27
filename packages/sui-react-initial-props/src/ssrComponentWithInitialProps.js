import React from 'react'
import ReactDOMServer from 'react-dom/server'
import InitialPropsContext from './initialPropsContext'

const EMPTY_FUNC = () => Promise.resolve({})

const hrTimeToMs = diff => diff[0] * 1e3 + diff[1] * 1e-6

export default function ssrComponentWithInitialProps({
  Target,
  context,
  renderProps,
  useStream = false
}) {
  const startGetInitialProps = process.hrtime()
  // get the page with the initialProps
  const pageComponent =
    renderProps.components[renderProps.components.length - 1]
  // use the getInitialProps from the page to retrieve the props to initialize
  const getInitialProps = pageComponent.getInitialProps || EMPTY_FUNC
  return getInitialProps(context).then(initialProps => {
    const diffGetInitialProps = process.hrtime(startGetInitialProps)
    console.log({initialProps})
    // Create App with Context with the initialProps
    const AppWithContext = (
      <InitialPropsContext.Provider value={{initialProps}}>
        <Target {...renderProps} initialProps={initialProps} />
      </InitialPropsContext.Provider>
    )
    // use a different action and response key depending if we're using streaming
    const [renderAction, renderResponseKey] = useStream
      ? [ReactDOMServer.renderToNodeStream, 'reactStream']
      : [ReactDOMServer.renderToString, 'reactString']
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
  })
}
