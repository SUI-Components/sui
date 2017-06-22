import React, { Component, PropTypes } from 'react'

import tryRequire from './try-require'

const reactDocs = require('react-docgen')
const Params = ({params}) => {
  return (
    <div className='sui-StudioMethods-param'>
      {
        params.map(
          (param, index) => {
            const type = param.type ? `[${param.type ? param.type.name : ''}]` : ''
            return (
              <p
                className='sui-StudioMethods-paramName'
                key={index}>
                {`${param.name} ${type}: ${param.description}`}
              </p>
            )
          }
        )
      }
    </div>
  )
}

Params.propTypes = {params: PropTypes.array}

const Methods = ({methods}) => {
  if (methods.length === 0) return null

  return (
    <div className='sui-StudioMethods'>
      <h3>Methods</h3>
      {
        methods.map((method, index) => (
          <div key={index} className='sui-StudioMethods-method'>
            <p className='sui-StudioMethods-methodName'>{`${method.name}: ${method.description || 'Missing description'}`}</p>
            <p className='sui-StudioMethods-methodParams'>Params</p>
            <Params params={method.params} />
            {
              method.description
                ? <p className='sui-StudioMethods-methodReturns'>{`Return: ${method.description}`}</p>
                : null
            }
          </div>
        ))
      }
    </div>
  )
}

Methods.displayName = 'Methods'
Methods.propTypes = {methods: PropTypes.array}

const Props = ({props = {}}) => {
  return (
    <div className='sui-StudioProps'>
      <h3>Props</h3>
      <table className='sui-StudioProps-table'>
        <tbody>
          <tr className='sui-StudioProps-head'>
            <td>Name</td>
            <td>Type</td>
            <td>Default</td>
            <td>Description</td>
          </tr>
          {
            Object
              .keys(props)
              .sort()
              .map((key, index) => {
                const prop = props[key]
                const required = prop.required
                                  ? <span className='sui-StudioProps-required'>* required</span>
                                  : undefined

                const description = prop.description || ''
                const type = prop.type ? prop.type.name : ''
                const defaultValue = prop.defaultValue ? prop.defaultValue.value : ''

                return (
                  <tr
                    className='sui-StudioProps-property'
                    key={index}>
                    <td>{key} {required}</td>
                    <td className='sui-StudioProps-type'>{type}</td>
                    <td>{defaultValue}</td>
                    <td>{description}</td>
                  </tr>
                )
              }
            )
          }
        </tbody>
      </table>
    </div>
  )
}
Props.displayName = 'Props'
Props.propTypes = {props: PropTypes.object}

class ReactDocGen extends Component {
  static propTypes = {
    params: PropTypes.shape({
      category: PropTypes.string,
      component: PropTypes.string
    })
  }

  state = { parsed: false }

  componentDidMount () {
    tryRequire(this.props.params).then(([src, _]) => this.setState({parsed: reactDocs.parse(src)}))
  }

  render () {
    const {parsed} = this.state
    return parsed && (
      <div className='sui-StudioReactDocGen'>
        <p className='sui-StudioReactDocGen-description'>
          {parsed.description || ''}
        </p>
        <div className='sui-StudioReactDocGen-methodsContainer'>
          <Methods methods={parsed.methods} />
        </div>
        <div className='sui-StudioReactDocGen-propsContainer'>
          <Props props={parsed.props} />
        </div>
      </div>
    )
  }
}

ReactDocGen.displayName = 'ReactDocGen'

export default ReactDocGen
