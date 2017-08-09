import React from 'react'
import ReactDOMServer from 'react-dom/server'
import withContext from '@schibstedspain/sui-hoc/lib/withContext'

export default function ssrComponentWithInitialProps ({ Target, context, renderProps }) {
  // get the page with the initialProps
  const pageComponent = renderProps.components[renderProps.components.length - 1]
  // use the getInitialProps from the page to retrieve the props to initialize
  return pageComponent
    .getInitialProps(context)
    .then(initialProps => {
      // create the App component with the context, the initialProps and the Target Component
      const App = withContext({ ...context, initialProps })(Target)
      // render our whole application with the needed props and get the html string
      const reactString = ReactDOMServer.renderToString(
        <App {...renderProps} initialProps={initialProps} />
      )
      return { initialProps, reactString }
    })
}
