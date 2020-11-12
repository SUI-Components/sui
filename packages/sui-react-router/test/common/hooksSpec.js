import {expect} from 'chai'
import {renderToString} from 'react-dom/server'
import {
  Route,
  Router,
  match,
  useLocation,
  useParams,
  useRouter
} from '../../src/index'

const getRenderedString = ({location = '/', withRoutes}) => {
  return new Promise(resolve => {
    match({routes: withRoutes, location}, (_, __, renderProps) =>
      resolve(renderToString(<Router {...renderProps} />))
    )
  })
}

describe('Hooks', () => {
  describe('useLocation', () => {
    it('returns the current location object', async () => {
      let location
      const HomePage = () => {
        location = useLocation()
        return null
      }
      const withRoutes = <Route path="/home" component={HomePage} />
      await getRenderedString({location: '/home', withRoutes})

      expect(location).to.be.an('object')
      expect(location).to.include({
        pathname: '/home'
      })
    })
  })

  describe('useParams', () => {
    it('returns the matched params on dynamic path', async () => {
      let params
      const BlogPage = () => {
        params = useParams()
        return null
      }
      const withRoutes = (
        <Route path="/post/:category/:slug" component={BlogPage} />
      )
      await getRenderedString({
        location: '/post/technology/new-product',
        withRoutes
      })

      expect(params).to.deep.equal({
        category: 'technology',
        slug: 'new-product'
      })
    })

    it('returns an empty object if none matched', async () => {
      let params
      const BlogPage = () => {
        params = useParams()
        return null
      }
      const withRoutes = <Route path="/post" component={BlogPage} />
      await getRenderedString({location: '/post', withRoutes})

      expect(params).to.deep.equal({})
    })
  })

  describe('useRouter', () => {
    it('returns the router object', async () => {
      let router
      const Page = () => {
        router = useRouter()
        return null
      }
      const withRoutes = <Route path="/post/:category/:slug" component={Page} />
      await getRenderedString({
        location: '/post/technology/new-product',
        withRoutes
      })

      // TODO: Improve this test
      expect(router).to.be.an('object')
    })
  })
})
