import {expect} from 'chai'
import {getInitialContextValue} from '../../server/initialContextValue'

describe('#getInitialContextValue', () => {
  const context = {
    domain: {fakeDomain: 'fakeDomain'},
    i18n: {i18n: 'fakeI18n'},
    pde: {
      getInitialValue: () => ({initialValue: 'initialValue'})
    },
    anotherContextWithoutInitialValue: {
      key: 'value'
    },
    anotherContextWithInitialValue: {
      key: 'withInitialValue',
      getInitialValue: () => ({
        some: 'data',
        any: 2
      })
    }
  }

  it('should return an object with the output of the initialValue fn for every context', () => {
    expect(getInitialContextValue(context)).to.deep.equal({
      pde: {initialValue: 'initialValue'},
      anotherContextWithInitialValue: {
        some: 'data',
        any: 2
      }
    })
  })
})
