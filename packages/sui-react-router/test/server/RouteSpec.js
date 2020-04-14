/* eslint-disable react/prop-types */

import {expect} from 'chai'
import React from 'react'
import {renderToString} from 'react-dom/server'
import {Router, Route, match} from '../../src/index'

const getRenderedString = ({location = '/', withRoutes}) => {
  return new Promise(resolve => {
    match({routes: withRoutes, location}, (_, __, renderProps) =>
      resolve(renderToString(<Router {...renderProps} />))
    )
  })
}

describe.only('<Route>', () => {
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
  const Detail = () => <h1>Detail Page</h1>
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
  })
})
