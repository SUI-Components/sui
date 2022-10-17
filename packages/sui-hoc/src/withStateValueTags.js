import {Component} from 'react'

import PropTypes from 'prop-types'

import withStateValue from './withStateValue.js'

const withStateValueTags = BaseComponent => {
  const displayName = BaseComponent.displayName

  class BaseComponentWithState extends Component {
    static displayName = `withStateValueTags(${displayName})`

    static propTypes = {
      /** tags */
      tags: PropTypes.any, // tags,

      /** value */
      value: PropTypes.any, // valueInput

      /** onChange callback  */
      onChange: PropTypes.func, // onChangeValue

      /** onChangeTags callback  */
      onChangeTags: PropTypes.func // onChangeTags
    }

    static defaultProps = {
      onChange: () => {},
      onChangeTags: () => {},
      value: ''
    }

    state = {
      tags: this.props.tags || [] // valueInput
    }

    onChangeTags = (e, valuesToPropagate) => {
      const {onChangeTags, onChange} = this.props // eslint-disable-line react/prop-types
      const {tags} = valuesToPropagate
      this.setState({tags}, () => {
        onChangeTags(e, valuesToPropagate)
        onChange(e, valuesToPropagate)
      })
    }

    onChange = (e, valuesToPropagate) => {
      const {onChange} = this.props
      onChange(e, valuesToPropagate)
    }

    render() {
      const {tags} = this.state
      const {value} = this.props
      const {onChangeTags, onChange, props} = this

      return (
        <BaseComponent
          {...props}
          tags={tags}
          value={value}
          onChangeTags={onChangeTags}
          onChange={onChange}
        />
      )
    }
  }

  return withStateValue(BaseComponentWithState)
}

export default withStateValueTags
