import {expect} from 'chai'
import {Router, Route, Link} from '../../src/index'
import {render, fireEvent, screen} from '@testing-library/react'
import sinon from 'sinon'
import createMemoryHistory from '../../src/createMemoryHistory'

describe('<Link />', () => {
  describe('when clicked', () => {
    it('calls a user defined click handler', async () => {
      const handleClick = sinon.spy()
      const PageWithLink = () => (
        <Link to="/hello" onClick={handleClick}>
          Link
        </Link>
      )

      render(
        <section id="app">
          <Router history={createMemoryHistory()}>
            <Route path="/hello" component={() => <h1>Hello</h1>} />
            <Route path="*" component={PageWithLink} />
          </Router>
        </section>
      )

      const elementToClick = await screen.findByText('Link')
      fireEvent.click(elementToClick)

      expect(handleClick.calledOnce).to.equal(true)
    })

    it('transitions to the correct route for string', async () => {
      let paramName
      const PageWithLink = () => <Link to="/hello/mister">Link</Link>
      const history = createMemoryHistory()
      render(
        <section id="app">
          <Router history={history}>
            <Route
              path="/hello/:name"
              component={({params}) => {
                paramName = params.name
                return <h1>Hello</h1>
              }}
            />
            <Route path="*" component={PageWithLink} />
          </Router>
        </section>
      )

      const elementToClick = await screen.findByText('Link')
      fireEvent.click(elementToClick)

      await screen.findByText('Hello')

      expect(paramName).to.equal('mister')
      expect(history.getCurrentLocation().pathname).to.equal('/hello/mister')
    })

    it('does not transition when onClick prevents default', async () => {
      const handleClick = sinon.spy()
      const PageWithLink = () => (
        <Link
          to="/hello"
          onClick={e => {
            e.preventDefault()
            handleClick()
          }}
        >
          Link
        </Link>
      )
      const history = createMemoryHistory()

      render(
        <section id="app">
          <Router history={history}>
            <Route path="/hello" component={() => <h1>Hello</h1>} />
            <Route path="*" component={PageWithLink} />
          </Router>
        </section>
      )

      const historySpy = sinon.spy(history, 'push')

      const elementToClick = await screen.findByText('Link')
      fireEvent.click(elementToClick)

      expect(handleClick.calledOnce).to.equal(true)
      expect(historySpy.callCount).to.equal(0)
    })

    it('does not transition when has target blank', async () => {
      const PageWithLink = () => (
        <Link to="/hello" target="_blank">
          Link
        </Link>
      )
      const history = createMemoryHistory()

      render(
        <section id="app">
          <Router history={history}>
            <Route path="/hello" component={() => <h1>Hello</h1>} />
            <Route path="*" component={PageWithLink} />
          </Router>
        </section>
      )

      const historySpy = sinon.spy(history, 'push')

      const elementToClick = await screen.findByText('Link')
      fireEvent.click(elementToClick)

      expect(historySpy.callCount).to.equal(0)
    })
  })

  describe('with params', () => {
    const createRoutes = (
      {to, withActiveProps = true, props = {}} // eslint-disable-line react/prop-types
    ) => (
      <Route>
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
        <Route
          path="*"
          component={() => <Link to="/hello/michael">Link</Link>}
        />
      </Route>
    )

    it('is active when its params match', async () => {
      render(
        <Router
          history={createMemoryHistory()}
          routes={createRoutes({to: '/hello/michael'})}
        />
      )
      fireEvent.click(await screen.findByText('Link'))
      const link = await screen.findByText('Link to Michael')
      expect(link.getAttribute('class')).to.equal('active')
      expect(link.getAttribute('style')).to.equal('color: red;')
    })

    it('is not active when its params dont match', async () => {
      render(
        <Router
          history={createMemoryHistory()}
          routes={createRoutes({to: '/hello/sui'})}
        />
      )
      fireEvent.click(await screen.findByText('Link'))
      const link = await screen.findByText('Link to Michael')
      expect(link.getAttribute('class')).to.equal(null)
    })
  })
})
