import React, {Component} from 'react'
import PropTypes from 'prop-types'

const clean = str => str.replace('_use_case', '')
const snakeToCamel = str =>
  str.replace(/(_\w)/g, match => match[1].toUpperCase())

const withStreamService = (...services) => Target =>
  class DDDStreamServicesInjector extends Component {
    static displayName = `withStreamService(${Target.displayName})`
    static originalContextTypes = Target.originalContextTypes ||
      Target.contextTypes
    static contextTypes = {
      domain: PropTypes.object.isRequired
    }

    componentWillMount () {
      const {domain} = this.context

      this._disposes = services
        .map(service => {
          const responseKey = `${snakeToCamel(clean(service))}$`
          const paramsKey = `${responseKey}Params`
          const errorKey = `${responseKey}Error`

          return domain.get(service).$.execute.subscribe(
            ({params, result}) => {
              this.setState({
                [responseKey]: result,
                [paramsKey]: params,
                [errorKey]: undefined
              })
            },
            ({params, error}) => {
              this.setState({
                [responseKey]: undefined,
                [paramsKey]: params,
                [errorKey]: error
              })
            }
          ).dispose
        })
        .reduce((acc, dispose, index) => {
          const disposeKey = `${snakeToCamel(clean(services[index]))}$Dispose`
          acc[disposeKey] = dispose
          return acc
        }, {})
    }

    componentWillUnmount () {
      Object.keys(this._disposes)
        .filter(key => !!key.match(/Dispose/))
        .forEach(key => {
          this._disposes[key]()
        })
    }

    render () {
      return <Target {...this.props} {...this._disposes} {...this.state} />
    }
  }

export default withStreamService
