import {expect} from 'chai'
import {Route, Redirect, match} from '../../src'

const getRedirectLocationFor = ({path = '/', withRoutes}) => {
  return new Promise(resolve => {
    match({routes: withRoutes, location: path}, (_, redirectLocation) =>
      resolve(redirectLocation)
    )
  })
}

describe('<Redirect>', () => {
  it('works with static paths', async () => {
    const withRoutes = <Redirect from="/" to="/es" />
    const redirectLocation = await getRedirectLocationFor({
      path: '/',
      withRoutes
    })
    expect(redirectLocation.pathname).to.equal('/es')
  })

  it('works with dynamic paths', async () => {
    const withRoutes = <Redirect from="/search/:id" to="/new-search/:id" />
    const redirectLocation = await getRedirectLocationFor({
      path: '/search/keyword',
      withRoutes
    })
    expect(redirectLocation.pathname).to.equal('/new-search/keyword')
  })

  // This is missing funcitonality from React Router v3
  it.skip('works with relative paths', async () => {
    const withRoutes = (
      <Route path="search">
        <Redirect from="category" to="categories" />
      </Route>
    )
    const redirectLocation = await getRedirectLocationFor({
      path: '/search/category',
      withRoutes
    })
    expect(redirectLocation.pathname).to.equal('/search/categories')
  })
})
