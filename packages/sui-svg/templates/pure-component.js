const template = (code, config, state) => {
  return `import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

export default class ${state.componentName} extends PureComponent {
  state = {render: this.props.ssr}

  componentDidMount() {
    if (this.state.render === false) {
      this.setState({render: true})
    }
  }

  render() {
    if (this.state.render === false) return null

    return (
      ${code}
    )
  }
}

${state.componentName}.propTypes = {
  ssr: PropTypes.bool
}

${state.componentName}.defaultProps = {
  ssr: false
}
`
}

module.exports = template
