// from: https://github.com/ReactTraining/react-router/blob/v3/modules/__tests__/getParams-test.js

import {expect} from 'chai'
import {getParams} from '../../src/PatternUtils'

describe('getParams', () => {
  describe('when a pattern does not have dynamic segments', () => {
    const pattern = '/a/b/c'

    describe('and the path matches', () => {
      it('returns an empty object', () => {
        expect(getParams(pattern, pattern)).to.deep.equal({})
      })
    })

    describe('and the path does not match', () => {
      it('returns null', () => {
        expect(getParams(pattern, '/d/e/f')).to.equal(null)
      })
    })
  })

  describe('when a pattern has dynamic segments', () => {
    const pattern = '/comments/:id.:ext/edit'

    describe('and the path matches', () => {
      it('returns an object with the params', () => {
        expect(getParams(pattern, '/comments/abc.js/edit')).to.deep.equal({
          id: 'abc',
          ext: 'js'
        })
      })
    })

    describe('and the pattern is optional', () => {
      const pattern = '/comments/(:id)/edit'

      describe('and the path matches with supplied param', () => {
        it('returns an object with the params', () => {
          expect(getParams(pattern, '/comments/123/edit')).to.deep.equal({
            id: '123'
          })
        })
      })

      describe('and the path matches without supplied param', () => {
        it('returns an object with an undefined param', () => {
          expect(getParams(pattern, '/comments//edit')).to.deep.equal({
            id: undefined
          })
        })
      })
    })

    describe('and the pattern and forward slash are optional', () => {
      const pattern = '/comments(/:id)/edit'

      describe('and the path matches with supplied param', () => {
        it('returns an object with the params', () => {
          expect(getParams(pattern, '/comments/123/edit')).to.deep.equal({
            id: '123'
          })
        })
      })

      describe('and the path matches without supplied param', () => {
        it('returns an object with an undefined param', () => {
          expect(getParams(pattern, '/comments/edit')).to.deep.equal({
            id: undefined
          })
        })
      })
    })

    describe('and the path does not match', () => {
      it('returns null', () => {
        expect(getParams(pattern, '/users/123')).to.equal(null)
      })
    })

    describe('and the path matches with a segment containing a .', () => {
      it('returns an object with the params', () => {
        expect(getParams(pattern, '/comments/foo.bar/edit')).to.deep.equal({
          id: 'foo',
          ext: 'bar'
        })
      })
    })
  })

  describe('when a pattern has characters that have special URL encoding', () => {
    const pattern = '/one, two'

    describe('and the path matches', () => {
      it('returns an empty object', () => {
        expect(getParams(pattern, '/one, two')).to.deep.equal({})
      })
    })

    describe('and the path does not match', () => {
      it('returns null', () => {
        expect(getParams(pattern, '/one two')).to.equal(null)
      })
    })
  })

  describe('when a pattern has dynamic segments and characters that have special URL encoding', () => {
    const pattern = '/comments/:id/edit now'

    describe('and the path matches', () => {
      it('returns an object with the params', () => {
        expect(getParams(pattern, '/comments/abc/edit now')).to.deep.equal({
          id: 'abc'
        })
      })
    })

    describe('and the path does not match', () => {
      it('returns null', () => {
        expect(getParams(pattern, '/users/123')).to.equal(null)
      })
    })

    describe('and the path contains multiple special URL encoded characters', () => {
      const pattern = '/foo/:component'

      describe('and the path matches', () => {
        it('returns the correctly decoded characters', () => {
          expect(getParams(pattern, '/foo/%7Bfoo%24bar')).to.deep.equal({
            component: '{foo$bar'
          })
        })
      })
    })
  })

  describe('when a pattern has a *', () => {
    describe('and the path matches', () => {
      it('returns an object with the params', () => {
        expect(getParams('/files/*', '/files/my/photo.jpg')).to.deep.equal({
          splat: 'my/photo.jpg'
        })
        expect(getParams('/files/*', '/files/my/photo.jpg.zip')).to.deep.equal({
          splat: 'my/photo.jpg.zip'
        })
        expect(getParams('/files/*.jpg', '/files/my/photo.jpg')).to.deep.equal({
          splat: 'my/photo'
        })
        expect(
          getParams('/files/*.jpg', '/files/my/new%0Aline.jpg')
        ).to.deep.equal({
          splat: 'my/new\nline'
        })
      })
    })

    describe('and the path does not match', () => {
      it('returns null', () => {
        expect(getParams('/files/*.jpg', '/files/my/photo.png')).to.equal(null)
      })
    })
  })

  describe('when a pattern has a **', () => {
    describe('and the path matches', () => {
      it('return an object with the params', () => {
        expect(getParams('/**/f', '/foo/bar/f')).to.deep.equal({
          splat: 'foo/bar'
        })
      })
    })

    describe('and the path does not match', () => {
      it('returns null', () => {
        expect(getParams('/**/f', '/foo/bar/')).to.equal(null)
      })
    })
  })

  describe('when a pattern has an optional group', () => {
    const pattern = '/archive(/:name)'

    describe('and the path matches', () => {
      it('returns an object with the params', () => {
        expect(getParams(pattern, '/archive/foo')).to.deep.equal({name: 'foo'})
        expect(getParams(pattern, '/archive')).to.deep.equal({name: undefined})
      })
    })

    describe('and the path does not match', () => {
      it('returns null', () => {
        expect(getParams(pattern, '/archiv')).to.equal(null)
      })
    })
  })

  describe('when a param has dots', () => {
    const pattern = '/:query/with/:domain'

    describe('and the path matches', () => {
      it('returns an object with the params', () => {
        expect(getParams(pattern, '/foo/with/foo.app')).to.deep.equal({
          query: 'foo',
          domain: 'foo.app'
        })
        expect(getParams(pattern, '/foo.ap/with/foo')).to.deep.equal({
          query: 'foo.ap',
          domain: 'foo'
        })
        expect(getParams(pattern, '/foo.ap/with/foo.app')).to.deep.equal({
          query: 'foo.ap',
          domain: 'foo.app'
        })
      })
    })

    describe('and the path does not match', () => {
      it('returns null', () => {
        expect(getParams(pattern, '/foo.ap')).to.equal(null)
      })
    })
  })

  describe('and the pattern is parentheses escaped', () => {
    const pattern = '/comments\\(test\\)'

    describe('and the path matches with supplied param', () => {
      it('returns an object with the params', () => {
        expect(getParams(pattern, '/comments(test)')).to.deep.equal({})
      })
    })

    describe('and the path does not match without parentheses', () => {
      it('returns an object with an undefined param', () => {
        expect(getParams(pattern, '/commentstest')).to.equal(null)
      })
    })
  })

  describe('and the pattern is parentheses escaped', () => {
    const pattern = '/comments\\(:id\\)'

    describe('and the path matches with supplied param', () => {
      it('returns an object with the params', () => {
        expect(getParams(pattern, '/comments(123)')).to.deep.equal({id: '123'})
      })
    })

    describe('and the path does not match without parentheses', () => {
      it('returns an object with an undefined param', () => {
        expect(getParams(pattern, '/commentsedit')).to.equal(null)
      })
    })
  })
})
