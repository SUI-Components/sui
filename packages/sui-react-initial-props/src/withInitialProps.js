import React, {useEffect, useState} from 'react'

// This HoC creates the PageComponent prepared for the Client Side Rendering
// It renders a placeholder, if any specified as `renderLoading` on the PageComponent
// Also, executes the getInitialProps to retrieve the initialProps and then
// Renders the component with the initialProps, hiding the placeholder
export default ({context, routeInfo}) => Page => {
  const ClientPage = props => {
    const [{initialProps, isLoading}, setState] = useState({
      initialProps: {},
      isLoading: false
    })

    useEffect(function() {
      Page.getInitialProps({context, routeInfo})
        .then(initialProps => {
          setState({initialProps, isLoading: false})
        })
        .catch(error => {
          setState({initialProps: {error}, isLoading: false})
        })
    })

    const renderLoading = () => {
      // check if the page has a renderLoading method, if not, just render nothing
      return Page.renderLoading ? Page.renderLoading() : null
    }

    return isLoading ? renderLoading() : <Page {...initialProps} {...props} />
  }
  // add ClientPage to name of the component
  ClientPage.displayName = `ClientPage(${Page.displayName})`
  // return the page
  return ClientPage
}
