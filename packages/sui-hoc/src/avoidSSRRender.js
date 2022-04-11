import {Component} from 'react'

export default Target =>
  class extends Component {
    static displayName = `avoidSSRRender(${Target.displayName})`

    state = {render: false}

    componentDidMount() {
      this.setState({render: true})
    }

    render() {
      return this.state.render && <Target {...this.props} />
    }
  }
