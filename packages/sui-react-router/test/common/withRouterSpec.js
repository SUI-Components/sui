import {expect} from 'chai'
import {renderToString} from 'react-dom/server'
import {withRouter, Router, Route, match} from '../../src/index'

const getRenderedString = ({location = '/', withRoutes}) => {
  return new Promise(resolve => {
    match({routes: withRoutes, location}, (_, __, renderProps) =>
      resolve(renderToString(<Router {...renderProps} />))
    )
  })
}

describe('withRouter', function() {
  const EmptyComponent = () => null
  EmptyComponent.displayName = 'EmptyComponent'

  it('should put router on props and keep external', async () => {
    let injectedProps = {}

    const ComponentWithRouter = withRouter(props => {
      injectedProps = props
      return null
    })

    const withRoutes = (
      <Route
        path="/"
        component={() => {
          // don't inject props, expect `withRouter`to do its job
          return <ComponentWithRouter otherProp />
        }}
      />
    )

    await getRenderedString({withRoutes})

    expect(injectedProps).to.include.keys(
      'location',
      'params',
      'routes',
      'router'
    )

    expect(injectedProps.otherProp).to.equal(true)
  })

  it('should set displayName automatically', async () => {
    expect(withRouter(EmptyComponent).displayName).to.equal(
      'withRouter(EmptyComponent)'
    )
  })

  it('should use displayName if passed as parameter', async () => {
    const displayName = 'AwesomeComponent'
    expect(withRouter(EmptyComponent, {displayName}).displayName).to.equal(
      displayName
    )
  })
})
