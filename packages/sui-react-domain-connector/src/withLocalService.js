import React, {Component} from 'react'
import PropTypes from 'prop-types'

const clean = str => str.replace('_use_case', '')
const snakeToCamel = str =>
  str.replace(/(_\w)/g, match => match[1].toUpperCase())

const withLocalService = (...services) => Target => {
  class DDDLocalServicesInjector extends Component {
    static displayName = `withLocalService(${Target.displayName})`
    static originalContextTypes = Target.originalContextTypes ||
    Target.contextTypes
    static contextTypes = {
      domain: PropTypes.object.isRequired
    }

    constructor(props, context) {
      super(props, context)

      this.state = services.reduce((acc, service) => {
        const response = snakeToCamel(clean(service))
        const params = `${response}Params`
        const error = `${response}Error`
        const loading = `${response}Loading`
        const called = `${response}Called`
        const useCase = snakeToCamel(service)

        acc[called] = false
        acc[loading] = false
        acc[useCase] = p => {
          this.setState({
            [response]: undefined,
            [params]: p,
            [error]: undefined,
            [loading]: true,
            [called]: true
          })
          context.domain
            .get(service)
            .execute(p)
            .then(result => {
              this.setState({
                [response]: result,
                [params]: p,
                [error]: undefined,
                [loading]: false,
                [called]: true
              })
            })
            .catch(err => {
              this.setState({
                [response]: undefined,
                [params]: p,
                [error]: err,
                [loading]: false,
                [called]: true
              })
            })
        }
        return acc
      }, {})
    }

    render() {
      return <Target {...this.props} {...this.state} />
    }
  }

  return DDDLocalServicesInjector
}

export default withLocalService
