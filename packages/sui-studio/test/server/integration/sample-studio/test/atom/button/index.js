import React from 'react'

import chai, {expect} from 'chai'
import chaiDOM from 'chai-dom'
import {render} from '@testing-library/react'

chai.use(chaiDOM)

describe('AtomButton', () => {
  it('Render', () => {
    render(<AtomButton />)
    expect(true).to.be.eql(false)
  })
})
