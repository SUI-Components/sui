/* eslint react/no-multi-comp:0 */
import React, {Component, PropTypes} from 'react'

import { iconClose, iconCode } from '../icons'
import Preview from '../preview'
import Style from '../style'

import tryRequire from './try-require'
import stylesFor, {themesFor} from './fetch-styles'
import CodeEditor from './CodeEditor'
import ContextButtons from './ContextButtons'
import EventsButtons from './EventsButtons'
import RoutesButtons from './RoutesButtons'
import ThemesButtons from './ThemesButtons'
import contextify from '../contextify'
import {matchPattern, compilePattern} from 'react-router/lib/PatternUtils' // Thx for that!
import deepmerge from 'deepmerge'

const DEFAULT_CONTEXT = 'default'
const EVIL_HACK_TO_RERENDER_AFTER_CHANGE = ' '

const contextByType = (ctxt, type) => deepmerge(ctxt[DEFAULT_CONTEXT], ctxt[type])
const isFunction = (fnc) => !!(fnc && fnc.constructor && fnc.call && fnc.apply)

export default class Demo extends Component {
  static bootstrapWith (demo, {category, component, style, themes}) {
    tryRequire({category, component}).then(([Component, playground, ctxt, routes, events]) => {
      if (routes) { compilePattern(routes.pattern) }
      if (isFunction(ctxt)) {
        return ctxt().then(context => {
          demo.setState({playground, Component, ctxt: context, routes, style, themes, events})
        })
      }

      demo.setState({playground, Component, ctxt, routes, style, themes, events})
    })
  }

  static propsWithParams (demo) {
    if (demo.state.routes && demo.props.params && demo.props.params.splat) {
      const matches = matchPattern(demo.state.routes.pattern, `/${demo.props.params.splat}`)
      const params = matches.paramNames.reduce((params, name, index) => {
        params[name] = matches.paramValues[index]
        return params
      }, {})
      return Object.assign(
        {},
        {'__v': Math.random()},
        demo.props,
        {
          routeParams: params,
          params: Object.assign(
            {},
            demo.props.params,
            params
          )
        }
      )
    }
    return demo.props
  }

  static propTypes = {
    category: PropTypes.string,
    component: PropTypes.string,
    params: PropTypes.shape({
      category: PropTypes.string,
      component: PropTypes.string
    })
  }

  state = {
    Component: (<div />),
    isCodeOpen: false,
    ctxt: false,
    ctxtSelectedIndex: 0,
    ctxtType: 'default',
    playground: undefined,
    routes: false,
    theme: 'default',
    themeSelectedIndex: 0,
    themes: []
  }

  _loadStyles ({ category, component }) {
    stylesFor({category, component}).then(style => {
      const themes = themesFor({category, component})
      Demo.bootstrapWith(this, {category, component, style, themes})
    })
  }

  componentDidMount () {
    this._loadStyles(this.props.params)
  }

  componentWillReceiveProps (nextProps) {
    this._loadStyles(nextProps.params)
  }

  render () {
    const {category, component} = this.props.params
    let {
      Component,
      ctxt,
      ctxtSelectedIndex,
      ctxtType,
      events,
      isCodeOpen,
      playground,
      routes,
      style,
      themeSelectedIndex,
      themes
    } = this.state

    let domain

    if (Component.contextTypes && ctxt) {
      Component = contextify(Component.contextTypes, contextByType(ctxt, ctxtType))(Component)
    }

    if (events && ctxt && ctxtType) {
      domain = contextByType(ctxt, ctxtType).domain
    }

    /* Begin Black Magic */
    // We want pass the routering props to the component in the demo
    const self = this
    const HOCComponent = class HOCComponent extends React.Component {
      render () { return (<Component {...Demo.propsWithParams(self)} {...this.props} />) }
    }
    HOCComponent.displayName = Component.displayName
    /* END Black Magic */

    return (
      <div className='sui-StudioDemo'>
        <Style>{style}</Style>
        <div className='sui-StudioNavBar-secondary'>
          <ContextButtons
            ctxt={ctxt || {}}
            selected={ctxtSelectedIndex}
            onContextChange={this.handleContextChange} />
          <ThemesButtons
            themes={themes}
            selected={themeSelectedIndex}
            onThemeChange={this.handleThemeChange} />
          <RoutesButtons routes={routes || {}} category={category} component={component} />
          <EventsButtons events={events || {}} domain={domain} />
        </div>

        <button className='sui-StudioDemo-codeButton' onClick={this.handleCode}>
          {isCodeOpen ? iconClose : iconCode }
        </button>

        {isCodeOpen && <CodeEditor
          isOpen={isCodeOpen}
          onChange={playground => { this.setState({playground}) }}
          playground={playground}
        />}

        <Preview
          code={playground}
          scope={{React, [`${Component.displayName || Component.name}`]: HOCComponent}}
        />
      </div>
    )
  }

  handleCode = () => {
    this.setState({isCodeOpen: !this.state.isCodeOpen})
  }

  handleContextChange = (ctxtType, index) => {
    this.setState({
      ctxtType,
      ctxtSelectedIndex: index,
      playground: this.state.playground + EVIL_HACK_TO_RERENDER_AFTER_CHANGE
    })
  }

  handleThemeChange = (theme, index) => {
    const {category, component} = this.props.params
    stylesFor({category, component, withTheme: theme}).then(style => {
      this.setState({
        style,
        theme,
        themeSelectedIndex: index
      })
    })
  }

  handleRoutering () {
    this.setState({playground: this.state.playground + EVIL_HACK_TO_RERENDER_AFTER_CHANGE})
  }
}
