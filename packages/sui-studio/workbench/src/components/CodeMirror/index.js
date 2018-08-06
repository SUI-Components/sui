import React from 'react'
import PropTypes from 'prop-types'

import CodeEditor from '../../../../src/components/demo/CodeEditor'
import {iconClose, iconCode} from '../../../../src/components/icons'

class CodeMirror extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    playground: PropTypes.string
  }

  state = {isOpen: false}

  render() {
    const {onChange, playground} = this.props
    const {isOpen} = this.state

    return (
      <React.Fragment>
        <button
          className="sui-StudioDemo-codeButton"
          onClick={this.handleClickButton}
        >
          {isOpen ? iconClose : iconCode}
        </button>
        <CodeEditor
          isOpen={isOpen}
          onChange={onChange}
          playground={playground}
        />
      </React.Fragment>
    )
  }
  handleClickButton = () => this.setState({isOpen: !this.state.isOpen})
}

export default CodeMirror
