import React, { Component } from 'react'

// This HoC creates the PageComponent prepared for the Client Side Rendering
// It renders a placeholder, if any specified as `renderLoading` on the PageComponent
// Also, executes the getInitialProps to retrieve the initialProps and then
// Renders the component with the initialProps, hiding the placeholder
export default ({ context, routeInfo }) => Page => (
  class ClientPage extends Component {
    static displayName = `ClientPage(${Page.displayName})`

    state = { initialProps: {}, isLoading: true }

    _renderLoading () {
      // check if the page has a renderLoading method, if not, just render nothing
      return Page.renderLoading ? Page.renderLoading() : null
    }

    componentDidMount () {
      // get the initialProps by executing the provided method on the page
      // when got the results, update the state to re-render the page hiding the placeholder
      Page.getInitialProps({ context, routeInfo })
        .then(initialProps => {
          this.setState({ initialProps, isLoading: false })
        })
    }

    render () {
      return this.state.isLoading
        ? this._renderLoading()
        : <Page {...this.state.initialProps} {...this.props} />
    }
  }
)
