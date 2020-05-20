/* eslint-disable react/prop-types */

import {expect} from 'chai'
import React from 'react'
import {renderToString} from 'react-dom/server'
import {IndexRoute, Router, Route, match} from '../../src/index'

const getRenderedString = ({location = '/', withRoutes}) => {
  return new Promise(resolve => {
    match({routes: withRoutes, location}, (_, __, renderProps) => {
      resolve(renderToString(<Router {...renderProps} />))
    })
  })
}

describe('<Route>', () => {
  const App = ({children}) => (
    <div>
      App<section>{children}</section>
    </div>
  )
  const Home = () => <h1>The HomePage</h1>
  const Search = ({params}) => (
    <h1>
      Search Results: <em>{params.keyword}</em>
    </h1>
  )
  const DontRender = () => {
    throw new Error('not supposed to be rendered')
  }

  it('works with static paths', async () => {
    const withRoutes = (
      <>
        <Route path="/" component={DontRender} />
        <Route path="/home" component={Home} />
      </>
    )

    const renderedString = await getRenderedString({
      location: '/home',
      withRoutes
    })

    expect(renderedString).to.contain('HomePage')
  })

  it('works with dynamic paths', async () => {
    const withRoutes = (
      <>
        <Route path="/" component={DontRender} />
        <Route path="/search/:keyword" component={Search} />
      </>
    )

    const renderedString = await getRenderedString({
      location: '/search/money',
      withRoutes
    })

    expect(renderedString)
      .to.contain('Search Results')
      .to.contain('money')
  })

  describe('with nested routes', () => {
    it('works with static paths', async () => {
      const withRoutes = (
        <Route path="/es" component={App}>
          <Route path="home" component={Home} />
        </Route>
      )

      const renderedString = await getRenderedString({
        location: '/es/home',
        withRoutes
      })

      expect(renderedString).to.equal(
        '<div>App<section><h1>The HomePage</h1></section></div>'
      )
    })

    it('works with dynamic paths', async () => {
      const withRoutes = (
        <Route path="/es" component={App}>
          <Route path="search/:keyword" component={Search} />
        </Route>
      )

      const renderedString = await getRenderedString({
        location: '/es/search/money',
        withRoutes
      })

      expect(renderedString).to.equal(
        '<div>App<section><h1>Search Results: <em>money</em></h1></section></div>'
      )
    })

    it('do not match when only part of the nested route is matched', async () => {
      const withRoutes = (
        <Route path="/es" component={App}>
          <Route path="search/:keyword" component={Search} />
        </Route>
      )

      const renderedString = await getRenderedString({
        location: '/es/this/dont/should/match',
        withRoutes
      })

      expect(renderedString).to.equal('')
    })

    it('match the specific correct route with specific priority', async () => {
      const withRoutes = (
        <Route path="/es" component={App}>
          <Route path="search/a" component={Search} />
          <Route
            path="search/:keyword"
            component={() => new Error('do not match ')}
          />
        </Route>
      )

      const renderedString = await getRenderedString({
        location: '/es/search/a',
        withRoutes
      })

      expect(renderedString).to.equal(
        '<div>App<section><h1>Search Results: <em></em></h1></section></div>'
      )
    })

    it('match the last route if previous dont working', async () => {
      const withRoutes = (
        <Route path="/es" component={App}>
          <Route path="dont/a" component={DontRender} />
          <Route path="dont/:keyword" component={DontRender} />
          <Route path="page" component={() => <h1>404</h1>} />
        </Route>
      )

      const renderedString = await getRenderedString({
        location: '/es/page',
        withRoutes
      })

      expect(renderedString)
        .to.include('App')
        .to.include('404')
    })

    it('match fallback route if previous dont working', async () => {
      const withRoutes = (
        <Route path="/es" component={App}>
          <Route path="dont/a" component={DontRender} />
          <Route path="dont/:keyword" component={DontRender} />
          <Route path="*" component={() => <h1>404</h1>} />
        </Route>
      )

      const renderedString = await getRenderedString({
        location: '/es/whatever',
        withRoutes
      })

      expect(renderedString)
        .to.include('App')
        .to.include('404')
    })
  })

  describe('receives the needed injected props', () => {
    it('with a static route', async () => {
      let injectedProps
      const HomePage = props => {
        injectedProps = props
        return null
      }
      const withRoutes = (
        <Route path="/home" component={HomePage}>
          home
        </Route>
      )
      await getRenderedString({location: '/home', withRoutes})

      // we have location object with correct data
      expect(injectedProps.location.pathname).to.equal('/home')
      expect(injectedProps.location.query).to.deep.equal({})
      // we have params objects with empty data
      expect(injectedProps.params).to.deep.equal({})
      expect(injectedProps.routeParams).to.deep.equal({})
      // we have the router object
      expect(injectedProps.router.getCurrentLocation).to.be.a('function')
      // we have on router same location object
      expect(injectedProps.router.location).to.equal(injectedProps.location)
      // we have on router same routes
      expect(injectedProps.routes[0].path).to.equal('/home')
      expect(injectedProps.routes[0].component).to.equal(HomePage)
      expect(injectedProps.router.routes).to.equal(injectedProps.routes)
      // we have the matched child route element to be rendered.
      expect(injectedProps.children)
    })

    it('with a dynamic route', async () => {
      let injectedProps
      const SearchPage = props => {
        injectedProps = props
        return null
      }
      const withRoutes = (
        <Route path="/search/:keyword" component={SearchPage}>
          home
        </Route>
      )
      await getRenderedString({location: '/search/cars', withRoutes})

      // we have location object with correct data
      expect(injectedProps.location.pathname).to.equal('/search/cars')
      expect(injectedProps.location.query).to.deep.equal({})
      // we have params objects with empty data
      expect(injectedProps.params).to.deep.equal({keyword: 'cars'})
      expect(injectedProps.routeParams).to.deep.equal({keyword: 'cars'})
      // we have the router object
      expect(injectedProps.router.getCurrentLocation).to.be.a('function')
      // we have on router same location object
      expect(injectedProps.router.location).to.equal(injectedProps.location)
      // we have on router same routes
      expect(injectedProps.routes[0].path).to.equal('/search/:keyword')
      expect(injectedProps.routes[0].component).to.equal(SearchPage)
      expect(injectedProps.router.routes).to.equal(injectedProps.routes)
      // we have the matched route info
      expect(injectedProps.route).to.includes({
        component: SearchPage,
        path: '/search/:keyword'
      })
    })

    it('with nested routes', async () => {
      let injectedPropsApp
      let injectedPropsSearch

      const AppPage = props => {
        injectedPropsApp = props
        return <div>{props.children}</div>
      }

      const SearchPage = props => {
        injectedPropsSearch = props
        return null
      }

      const withRoutes = (
        <Route path="/:lang" component={AppPage}>
          <IndexRoute
            component={() => {
              throw new Error('not here')
            }}
          />
          <Route path="search/:keyword" component={SearchPage} />
        </Route>
      )
      await getRenderedString({location: '/es/search/cars', withRoutes})

      expect(injectedPropsApp.params)
        .to.deep.equal({
          lang: 'es',
          keyword: 'cars'
        })
        .to.equal(injectedPropsSearch.params)

      expect(injectedPropsApp.router).to.equal(injectedPropsSearch.router)

      expect(injectedPropsApp.route).to.includes({
        path: 'search/:keyword',
        component: SearchPage
      })
    })
  })
})
