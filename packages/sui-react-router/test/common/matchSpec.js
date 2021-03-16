import {expect} from 'chai'
import {Redirect, Route, match} from '../../src/index'

const matchPromise = ({location = '/', withRoutes}) => {
  return new Promise(resolve => {
    match(
      {routes: withRoutes, location},
      (err, redirectLocation, renderProps) =>
        resolve({err, redirectLocation, renderProps})
    )
  })
}

describe('match', () => {
  const EmptyComponent = () => {}

  it('should return falsy value as renderProps when no route is matched', async () => {
    const withRoutes = (
      <Route path="/es" component={EmptyComponent}>
        <Route path="dont/a" component={EmptyComponent} />
        <Route path="dont/:keyword" component={EmptyComponent} />
        <Route path="page" component={() => <h1>404</h1>} />
      </Route>
    )

    const {err, renderProps} = await matchPromise({
      location: '/home',
      withRoutes
    })

    expect(err).to.equal(undefined)
    expect(Boolean(renderProps)).to.equal(false)
  })

  it('should return redirectTo when Redirect is match', async () => {
    const withRoutes = (
      <>
        <Route path="/es" component={EmptyComponent}>
          <Route path="dont/a" component={EmptyComponent} />
          <Route path="dont/:keyword" component={EmptyComponent} />
          <Route path="page" component={() => <h1>404</h1>} />
        </Route>
        <Redirect from="/home" to="/" />
      </>
    )

    const {redirectLocation} = await matchPromise({
      location: '/home',
      withRoutes
    })

    expect(redirectLocation).to.contain({pathname: '/'})
  })
})
