import React from 'react'
import PropTypes from 'prop-types'

class Select extends React.PureComponent {
  static propTypes = {
    initValue: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
  }

  state = {value: this.props.initValue}

  render() {
    const {value} = this.state
    const {options, label} = this.props
    if (!Object.keys(options).length) {
      return null
    }
    return (
      <label className="Select">
        <span className="Select-label">{label}</span>
        <select value={value} onChange={this.handleChangeSelect}>
          {Object.keys(options).map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    )
  }

  handleChangeSelect = event => {
    const nextValue = event.target.value
    this.setState({value: nextValue})
    this.props.onChange(nextValue)
  }
}

export default Select
