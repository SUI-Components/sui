/* eslint no-unused-expressions:0 */
/* eslint-env mocha */

import React from 'react'
import {expect} from 'chai'
import {render} from '@testing-library/react'
import withInitialProps from '../../lib/withInitialProps.js'

describe('@s-ui/react-initial-props on client', () => {
  it('withInitialProps', () => {
    window.__INITIAL_PROPS__ = {title: 'Testing'}

    const Component = withInitialProps(props => <div>{props.title}</div>)

    const wrapper = render(
      <Component location={{pathname: '/'}} routes={[]} params={{}} />
    )
    wrapper.debug()

    expect(wrapper.getByText('Testing')).to.exist
  })
})
