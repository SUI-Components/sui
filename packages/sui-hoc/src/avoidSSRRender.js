import React, {Component} from 'react'

export default Target => class extends Component {
  static displayName = `avoidSSRRender(${Target.displayName})`

  constructor (props, context) {
    super(props, context)

    this.state = {render: false}
  }

  componentDidMount () {
    this.setState({render: true})
  }

  render () {
    return this.state.render && <Target {...this.props} />
  }
}
