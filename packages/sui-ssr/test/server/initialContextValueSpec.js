import {expect} from 'chai'
import {getInitialContextValue} from '../../server/initialContextValue'

describe('#getInitialContextValue', () => {
  it('should return an object with the output of the initialValue fn for every context', () => {
    const context = {
      domain: {fakeDomain: 'fakeDomain'},
      i18n: {i18n: 'fakeI18n'},
      pde: {
        getInitialData: () => ({initialValue: 'initialValue'})
      },
      anotherContextWithoutInitialValue: {
        key: 'value'
      },
      anotherContextWithInitialValue: {
        key: 'withInitialValue',
        getInitialData: () => ({
          some: 'data',
          any: 2
        })
      }
    }

    expect(getInitialContextValue(context)).to.deep.equal({
      pde: {initialValue: 'initialValue'},
      anotherContextWithInitialValue: {
        some: 'data',
        any: 2
      }
    })
  })

  it('should return nothing if no getInitialValue is set', () => {
    const context = {
      domain: {fakeDomain: 'fakeDomain'},
      i18n: {i18n: 'fakeI18n'}
    }

    expect(getInitialContextValue(context)).to.deep.equal({})
  })
})
