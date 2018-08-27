import PropTypes from 'prop-types'
import React, {Component, Fragment} from 'react'
import {tryRequireRawSrc} from '../tryRequire'

class Api extends Component {
  static propTypes = {
    params: PropTypes.shape({
      category: PropTypes.string,
      component: PropTypes.string
    })
  }

  state = {docs: false}

  async componentDidMount() {
    const reactDocs = await import('react-docgen')
    const src = await tryRequireRawSrc(this.props.params)
    const docs = reactDocs.parse(src)

    this.setState({docs})
  }

  _renderPropsApi({propsApi = {}}) {
    const keysOfProps = Object.keys(propsApi).sort((a, b) => a.localeCompare(b))
    // if the component doesn't have props, show a message
    if (keysOfProps.length === 0) {
      return <p>This component doesn't have props</p>
    }
    // if we have props, render all of them using React
    const renderedProps = keysOfProps.map(propName => {
      const {defaultValue = {}, required, type, description} = propsApi[
        propName
      ]
      const {value = undefined} = defaultValue

      if (typeof type === 'undefined') {
        console.warn( // eslint-disable-line
          'It seem that you might have a prop with a defaultValue but it does not exist as propType'
        )
        return
      }

      return (
        <div className="sui-StudioProps-prop" key={propName}>
          <h3>{propName}</h3>
          <div className="sui-StudioProps-tags">
            <div className="sui-StudioProps-tag sui-StudioProps-required">
              <span>required</span>
              <span className={required ? 'is-required' : ''}>
                {required ? 'yes' : 'no'}
              </span>
            </div>
            <div className="sui-StudioProps-tag sui-StudioProps-type">
              <span>type</span>
              <span>{type.name}</span>
            </div>
            {value && (
              <div className="sui-StudioProps-tag sui-StudioProps-default">
                <span>defaultValue</span>
                <span>{value}</span>
              </div>
            )}
          </div>
          {description && <p>{description}</p>}
        </div>
      )
    })
    // return all the rendered props with a title
    return [<h2 key="propTitles">Props</h2>, ...renderedProps]
  }

  render() {
    const {docs} = this.state

    if (docs) {
      const {
        params: {category, component}
      } = this.props
      const componentTitle = `${docs.displayName} (${category}/${component})`
      const {props} = docs

      return (
        <Fragment>
          <h1>{componentTitle}</h1>
          {this._renderPropsApi({propsApi: props})}
        </Fragment>
      )
    }

    return null
  }
}

Api.displayName = 'Api'

export default Api
