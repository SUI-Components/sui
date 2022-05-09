/* eslint-disable react/prop-types */
/* eslint no-unused-expressions:0 */
/* eslint-env mocha */

import React from 'react'
import {expect} from 'chai'
import {render, screen} from '@testing-library/react'
import withInitialProps from '../../lib/withInitialProps.js'

describe('react-initial-props', () => {
  it('should get props from __INITIAL_PROPS__', () => {
    window.__INITIAL_PROPS__ = {title: 'Testing'}

    const Component = withInitialProps(props => <div>{props.title}</div>)

    render(<Component location={{pathname: '/'}} routes={[]} params={{}} />)

    expect(screen.getByText('Testing')).to.exist
  })

  it('should call getInitialProps and render loading and success state', async () => {
    const Test = ({text}) => {
      return <div>{text}</div>
    }

    Test.renderLoading = () => {
      return <div>Loading</div>
    }

    Test.getInitialProps = async () => {
      return {text: 'Success'}
    }

    const Component = withInitialProps(Test)

    render(<Component location={{pathname: '/'}} routes={[]} params={{}} />)

    expect(await screen.findByText('Loading')).to.exist
    expect(await screen.findByText('Success')).to.exist
  })

  it('should call getInitialProps and render loading and error state', async () => {
    const Test = ({error}) => {
      return error ? <div>Error</div> : null
    }

    Test.renderLoading = () => {
      return <div>Loading</div>
    }

    Test.getInitialProps = async () => {
      throw new Error()
    }

    const Component = withInitialProps(Test)

    render(<Component location={{pathname: '/'}} routes={[]} params={{}} />)

    expect(await screen.findByText('Loading')).to.exist
    expect(await screen.findByText('Error')).to.exist
  })
})
