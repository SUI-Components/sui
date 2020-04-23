/* @global describe */

import {expect} from 'chai'
import isActive from '../../src/internal/isActive'

const DEFAULT = {pathname: '/home', query: null}
const LOCATIONS = {
  HOME: DEFAULT,
  SEARCH: {...DEFAULT, pathname: '/search'},
  HOME_WITH_QUERY: {...DEFAULT, query: {param1: 1, param2: 'b'}},
  HOME_WITH_OTHER_QUERY: {
    ...DEFAULT,
    query: {param3: 'a', param2: 'b'}
  },
  HOME_WITH_QUERY_STRING: {
    ...DEFAULT,
    query: {param1: '1', param2: 'b'}
  }
}

describe('isActive', () => {
  describe('a pathname that matches the URL', () => {
    describe('with no query', () => {
      it('is active', () => {
        expect(isActive(LOCATIONS.HOME, false, LOCATIONS.HOME)).to.be.true
      })
    })

    describe('with a query that also matches', () => {
      it('is active', () => {
        expect(
          isActive(LOCATIONS.HOME_WITH_QUERY, false, LOCATIONS.HOME_WITH_QUERY)
        ).to.be.true
      })
    })

    describe('with a query that also matches by value, but not by type', () => {
      it('is active', () => {
        expect(
          isActive(
            LOCATIONS.HOME_WITH_QUERY,
            false,
            LOCATIONS.HOME_WITH_QUERY_STRING
          )
        ).to.be.true
      })
    })

    describe('with a query that does not match', () => {
      it('is not active', () => {
        expect(
          isActive(
            LOCATIONS.HOME_WITH_QUERY,
            false,
            LOCATIONS.HOME_WITH_OTHER_QUERY
          )
        ).to.be.false
      })
    })
  })
})
