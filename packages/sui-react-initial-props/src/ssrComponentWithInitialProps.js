import React from 'react'
import ReactDOMServer from 'react-dom/server'
import withContext from '@s-ui/hoc/lib/withContext'

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
    // create the App component with the context, the initialProps and the Target Component
    const App = withContext({...context, initialProps})(Target)
    if (useStream) {
      const reactStream = ReactDOMServer.renderToNodeStream(
        <App {...renderProps} initialProps={initialProps} />
      )
      return {
        initialProps,
        reactStream,
        performance: {
          getInitialProps: hrTimeToMs(diffGetInitialProps)
        }
      }
    } else {
      // start to calculate renderToString
      const startRenderToString = process.hrtime()
      // render our whole application with the needed props and get the html string
      const reactString = ReactDOMServer.renderToString(
        <App {...renderProps} initialProps={initialProps} />
      )
      const diffRenderToString = process.hrtime(startRenderToString)
      return {
        initialProps,
        reactString,
        performance: {
          getInitialProps: hrTimeToMs(diffGetInitialProps),
          renderToString: hrTimeToMs(diffRenderToString)
        }
      }
    }
  })
}
