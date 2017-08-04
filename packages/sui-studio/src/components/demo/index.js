/* eslint react/no-multi-comp:0, no-console:0 */

import React, {Component, PropTypes} from 'react'

import { iconClose, iconCode } from '../icons'
import Preview from '../preview'
import Style from '../style'

import tryRequire from './try-require'
import stylesFor, {themesFor} from './fetch-styles'
import CodeEditor from './CodeEditor'
import ContextButtons from './ContextButtons'
import EventsButtons from './EventsButtons'
import ThemesButtons from './ThemesButtons'
import withContext from './HoC/withContext'
import withProvider from './HoC/withProvider'
import deepmerge from 'deepmerge'

import {createStore} from '@schibstedspain/ddd-react-redux'

const DEFAULT_CONTEXT = 'default'
const EVIL_HACK_TO_RERENDER_AFTER_CHANGE = ' '
const DDD_REACT_REDUX = '@schibstedspain/ddd-react-redux'

const createContextByType = (ctxt, type) => {
  // check if the user has created a context.js with the needed contextTypes
  if (typeof ctxt !== 'object' || ctxt === null) {
    console.warn('[Studio] You\'re trying to use a contextType in your component but it seems that you haven\'t created a context.js in the playground folder. This will likely make your component won\'t work as expected or it might have an useless context.')
  }
  return deepmerge(ctxt[DEFAULT_CONTEXT], ctxt[type])
}

const isFunction = (fnc) => !!(fnc && fnc.constructor && fnc.call && fnc.apply)
const cleanDisplayName = displayName => {
  const [fallback, name] = displayName.split(/\w+\((\w+)\)/)
  return name !== undefined ? name : fallback
}
const pipe = (...funcs) => arg => funcs.reduce((value, func) => func(value), arg)

export default class Demo extends Component {
  static bootstrapWith (demo, {category, component, style, themes}) {
    tryRequire({category, component}).then(([Base, playground, ctxt, routes, events, pkg]) => {
      if (isFunction(ctxt)) {
        return ctxt().then(context => {
          demo.setState({playground, Base, ctxt: context, routes, style, themes, events, pkg})
        })
      }

      demo.setState({playground, Base, ctxt, routes, style, themes, events, pkg})
    })
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
    Base: false,
    isCodeOpen: false,
    ctxt: false,
    ctxtSelectedIndex: 0,
    ctxtType: 'default',
    playground: undefined,
    routes: false,
    theme: 'default',
    pkg: false,
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
    let {
      Base,
      ctxt,
      ctxtSelectedIndex,
      ctxtType,
      events,
      isCodeOpen,
      pkg,
      playground,
      style,
      themeSelectedIndex,
      themes
    } = this.state

    if (!Base) { return <h1>Loading...</h1> }

    const contextTypes = Base.contextTypes || Base.originalContextTypes
    const context = contextTypes && createContextByType(ctxt, ctxtType)
    const {domain} = context || {}
    const hasProvider = pkg && pkg.dependencies && pkg.dependencies[DDD_REACT_REDUX]
    const store = domain && hasProvider && createStore(domain)

    const Enhance = pipe(
      withContext(contextTypes && context, context),
      withProvider(hasProvider, store)
    )(Base)

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
          <EventsButtons events={events || {}} store={store} domain={domain} />
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
          scope={{React, [`${cleanDisplayName(Enhance.displayName || Enhance.name)}`]: Enhance, domain}}
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
