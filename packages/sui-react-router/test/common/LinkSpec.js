import {expect} from 'chai'
import {renderToString} from 'react-dom/server'
import {Router, Route, Link, match} from '../../src/index'

const getRenderedString = ({location = '/', withRoutes}) => {
  return new Promise(resolve => {
    match({routes: withRoutes, location}, (_, __, renderProps) =>
      resolve(renderToString(<Router {...renderProps} />))
    )
  })
}

describe('<Link />', () => {
  const createRoutes = (
    {to, withActiveProps = true, props = {}} // eslint-disable-line react/prop-types
  ) => (
    <Route
      path="/hello/:name"
      component={() => (
        <Link
          {...(withActiveProps && {
            activeClassName: 'active',
            activeStyle: {color: 'red'}
          })}
          to={to}
          {...props}
        >
          Link to Michael
        </Link>
      )}
    />
  )

  it('should not render unnecessary class=""', async () => {
    const renderedString = await getRenderedString({
      location: '/hello/michael',
      withRoutes: createRoutes({to: '/hello/michael', withActiveProps: false})
    })

    expect(renderedString).not.to.contain('class')
  })

  describe('with params', () => {
    // strings to check if the Link is active
    const isActiveChecks = ['class="active"', 'style="color:red"']

    it('is active when its params match', async () => {
      const renderedString = await getRenderedString({
        location: '/hello/michael',
        withRoutes: createRoutes({to: '/hello/michael'})
      })

      isActiveChecks.forEach(c => expect(renderedString).to.contain(c))
    })

    it('is not active when its params dont match', async () => {
      const renderedString = await getRenderedString({
        location: '/hello/dan',
        withRoutes: createRoutes({to: '/hello/michael'})
      })

      isActiveChecks.forEach(c => expect(renderedString).not.to.contain(c))
    })

    it('is active when its params and query match', async () => {
      const renderedString = await getRenderedString({
        location: '/hello/dan?from=query',
        withRoutes: createRoutes({to: '/hello/dan?from=query'})
      })

      isActiveChecks.forEach(c => expect(renderedString).to.contain(c))
    })

    it('is active when its params match but query dont', async () => {
      const renderedString = await getRenderedString({
        location: '/hello/dan?from=query',
        withRoutes: createRoutes({to: '/hello/dan?from=anotherQuery'})
      })

      isActiveChecks.forEach(c => expect(renderedString).not.to.contain(c))
    })
  })

  describe('with function to', () => {
    it('use the correct href returned by the function', async () => {
      const renderedString = await getRenderedString({
        location: '/hello/dan?from=query',
        withRoutes: createRoutes({
          to: location => `${location.pathname}?from=function`
        })
      })

      expect(renderedString).to.contain('href="/hello/dan?from=function"')
    })
  })

  describe('when the "to" prop is unspecified', () => {
    it('returns an anchor tag without an href', async () => {
      const renderedString = await getRenderedString({
        location: '/hello/dan',
        withRoutes: createRoutes({to: undefined})
      })

      expect(renderedString).not.to.contain('href')
    })

    it('passes down other props', async () => {
      const renderedString = await getRenderedString({
        location: '/hello/dan',
        withRoutes: createRoutes({
          to: undefined,
          props: {className: 'linkClass', title: 'linkTitle'}
        })
      })

      expect(renderedString).to.contain('class="linkClass"')
      expect(renderedString).to.contain('title="linkTitle"')
    })
  })
})
