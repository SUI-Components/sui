import {useContext, useEffect, useRef, useState} from 'react'

import SUIContext from '@s-ui/react-context'

const INITIAL_PROPS_KEY = '__INITIAL_PROPS__'

// used to store the last definition of ClientPage component so it can be reused
let latestClientPage

const getInitialPropsFromWindow = () => {
  // if no window initial props, then do nothing
  if (typeof window[INITIAL_PROPS_KEY] === 'undefined') return
  // return retrieved props from window
  return window[INITIAL_PROPS_KEY]
}

// extract needed info from props for routeInfo object
const createRouteInfoFromProps = ({location, params, routes}) => ({
  location,
  params,
  routes
})

// This HoC creates the PageComponent prepared for the Client Side Rendering
// It renders a placeholder, if any specified as `renderLoading` on the PageComponent.
// Also, executes the getInitialProps to retrieve the initialProps and then
// renders the component with the initialProps, hiding the placeholder.
//
// Additionally, if `keepMounted` on the PageComponent is true, it keeps the
// component alive by running getInitialProps again when a route change is done
// and the very same component is matched by the router, so PageComponent just
// gets props updated. Also, since PageComponent keeps mounted it will receive
// an `isLoading` prop while getInitialProps is in progress.
export default Page => {
  // gather window initial props for this Page, if present
  const windowInitialProps = getInitialPropsFromWindow()
  // remove the variable of the window
  window[INITIAL_PROPS_KEY] = null

  // define Page wrapper component
  const ClientPage = props => {
    const initialPropsFromWindowRef = useRef(windowInitialProps)
    // used to know if initialProps has been requested at least once
    const requestedInitialPropsOnceRef = useRef(windowInitialProps != null)
    // create routeInfo object from current props which are updated
    const routeInfo = createRouteInfoFromProps(props)
    // consume sui context from the context provider
    const suiContext = useContext(SUIContext)
    // pathName from context is outdated, so we update it from routeInfo
    const context = {...suiContext, pathName: routeInfo.location.pathname}

    const [{initialProps, isLoading}, setState] = useState(() => ({
      initialProps: initialPropsFromWindowRef.current ?? {},
      isLoading: initialPropsFromWindowRef.current == null
    }))

    useEffect(() => {
      // check if got initial props from window, because then there's no need
      // to request them again from client

      if (initialPropsFromWindowRef.current != null) {
        initialPropsFromWindowRef.current = undefined
      } else {
        if (!routeInfo.location.state?.shallow) {
          // only update state if already request initial props
          if (requestedInitialPropsOnceRef.current) {
            setState({initialProps, isLoading: true})
          }

          Page.getInitialProps({context, routeInfo})
            .then(initialProps => {
              const {__HTTP__: http} = initialProps

              if (http?.redirectTo !== undefined) {
                window.location = http.redirectTo
                return
              }

              setState({initialProps, isLoading: false})
            })
            .catch(error => {
              setState({initialProps: {error}, isLoading: false})
            })
            .finally(() => {
              if (requestedInitialPropsOnceRef.current) return
              requestedInitialPropsOnceRef.current = true
            })
        }
      }
    }, [routeInfo.location]) // eslint-disable-line react-hooks/exhaustive-deps

    const renderPage = () => <Page {...initialProps} {...props} isLoading={isLoading} />

    const renderLoading = () => {
      // check if the page has a `renderLoading` method, if not, just render nothing
      return Page.renderLoading != null ? Page.renderLoading({context, routeInfo}) : null
    }

    return isLoading ? renderLoading() : renderPage()
  }

  // if `keepMounted` property is found and the component is the same one,
  // we just reuse it instead of returning a new one
  if (Page.displayName === latestClientPage?.Page?.displayName) {
    return latestClientPage
  }

  const displayName = Page.displayName ?? 'WithoutDisplayName'

  // save original page component
  ClientPage.Page = Page
  // add ClientPage to name of the component
  ClientPage.displayName = `ClientPage(${displayName})`
  // save ClientPage to latestClientPage
  latestClientPage = ClientPage
  // return the page
  return ClientPage
}
