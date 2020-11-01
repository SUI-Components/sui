import {expect} from 'chai'

import createMemoryHistory from '../../src/createMemoryHistory'

describe('createMemoryHistory', () => {
  it('adds query empty object when no querystring is present', () => {
    const history = createMemoryHistory()
    expect(history.getCurrentLocation().query).to.deep.equal({})
  })

  it('adds query object with querystring data', () => {
    const history = createMemoryHistory('/search?keyword=car')
    expect(history.getCurrentLocation().query).to.deep.equal({keyword: 'car'})
  })
})
