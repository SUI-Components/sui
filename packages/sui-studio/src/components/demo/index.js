/* eslint react/no-multi-comp:0, no-console:0 */

import PropTypes from 'prop-types'
import React, {Component} from 'react'

import {iconClose, iconCode, iconFullScreen, iconFullScreenExit} from '../icons'
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

import {createStore} from '@s-ui/react-domain-connector'

const DEFAULT_CONTEXT = 'default'
const EVIL_HACK_TO_RERENDER_AFTER_CHANGE = ' '
const DDD_REACT_REDUX = '@schibstedspain/ddd-react-redux'
const REACT_DOMAIN_CONNECTOR = '@s-ui/react-domain-connector'
const CONTAINER_CLASS = 'sui-Studio'
const FULLSCREEN_CLASS = 'sui-Studio--fullscreen'

const createContextByType = (ctxt, type) => {
  // check if the user has created a context.js with the needed contextTypes
  if (typeof ctxt !== 'object' || ctxt === null) {
    console.warn(
      "[Studio] You're trying to use a contextType in your component but it seems that you haven't created a context.js in the playground folder. This will likely make your component won't work as expected or it might have an useless context."
    )
  }
  return deepmerge(ctxt[DEFAULT_CONTEXT], ctxt[type])
}

const isFunction = fnc => !!(fnc && fnc.constructor && fnc.call && fnc.apply)
const cleanDisplayName = displayName => {
  const [fallback, name] = displayName.split(/\w+\((\w+)\)/)
  return name !== undefined ? name : fallback
}
const pipe = (...funcs) => arg =>
  funcs.reduce((value, func) => func(value), arg)

const removeDefaultContext = exports => {
  const {[DEFAULT_CONTEXT]: toOmit, ...restOfExports} = exports
  return restOfExports
}

export default class Demo extends Component {
  static async bootstrapWith (demo, {category, component, style, themes}) {
    const [exports, playground, ctxt, events, pkg] = await tryRequire({
      category,
      component
    })
    const context = isFunction(ctxt) ? await ctxt() : ctxt

    demo.setState({
      events,
      exports,
      pkg,
      playground,
      style,
      themes,
      ctxt: context
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
    ctxt: false,
    ctxtSelectedIndex: 0,
    ctxtType: 'default',
    exports: false,
    isCodeOpen: false,
    isFullScreen: false,
    pkg: false,
    playground: undefined,
    theme: 'default',
    themes: [],
    themeSelectedIndex: 0
  }

  _loadStyles ({category, component}) {
    stylesFor({category, component}).then(style => {
      const themes = themesFor({category, component})
      Demo.bootstrapWith(this, {category, component, style, themes})
    })
  }

  _checkIfPackageHasProvider ({pkg}) {
    return (
      pkg &&
      pkg.dependencies &&
      (pkg.dependencies[DDD_REACT_REDUX] ||
        pkg.dependencies[REACT_DOMAIN_CONNECTOR])
    )
  }

  componentDidMount () {
    this._loadStyles(this.props.params)
  }

  componentWillReceiveProps (nextProps) {
    this._loadStyles(nextProps.params)
  }

  componentWillUnmount () {
    this.containerClassList && this.containerClassList.remove(FULLSCREEN_CLASS)
  }

  handleCode = () => {
    this.setState({isCodeOpen: !this.state.isCodeOpen})
  }

  handleFullScreen = () => {
    this.setState({isFullScreen: !this.state.isFullScreen}, () => {
      const {isFullScreen} = this.state
      this.containerClassList =
        this.containerClassList ||
        document.getElementsByClassName(CONTAINER_CLASS)[0].classList

      isFullScreen
        ? this.containerClassList.add(FULLSCREEN_CLASS)
        : this.containerClassList.remove(FULLSCREEN_CLASS)
    })
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

  render () {
    let {
      ctxt,
      ctxtSelectedIndex,
      ctxtType,
      events,
      exports,
      isCodeOpen,
      isFullScreen,
      pkg,
      playground,
      style,
      themes,
      themeSelectedIndex
    } = this.state

    const Base = exports.default
    if (!Base) {
      return <h1>Loading...</h1>
    }

    const nonDefaultExports = removeDefaultContext(exports)
    const contextTypes = Base.contextTypes || Base.originalContextTypes
    const context = contextTypes && createContextByType(ctxt, ctxtType)
    const {domain} = context || {}
    const hasProvider = this._checkIfPackageHasProvider({pkg})
    const store = domain && hasProvider && createStore(domain)

    const Enhance = pipe(
      withContext(contextTypes && context, context),
      withProvider(hasProvider, store)
    )(Base)

    !Enhance.displayName &&
      console.error(new Error('Component.displayName must be defined.'))

    return (
      <div className='sui-StudioDemo'>
        <Style>{style}</Style>
        <div className='sui-StudioNavBar-secondary'>
          <ContextButtons
            ctxt={ctxt || {}}
            selected={ctxtSelectedIndex}
            onContextChange={this.handleContextChange}
          />
          <ThemesButtons
            themes={themes}
            selected={themeSelectedIndex}
            onThemeChange={this.handleThemeChange}
          />
          <EventsButtons events={events || {}} store={store} domain={domain} />
        </div>

        <button className='sui-StudioDemo-codeButton' onClick={this.handleCode}>
          {isCodeOpen ? iconClose : iconCode}
        </button>

        <button
          className='sui-StudioDemo-fullScreenButton'
          onClick={this.handleFullScreen}
        >
          {isFullScreen ? iconFullScreenExit : iconFullScreen}
        </button>

        {isCodeOpen && (
          <CodeEditor
            isOpen={isCodeOpen}
            onChange={playground => {
              this.setState({playground})
            }}
            playground={playground}
          />
        )}

        <Preview
          code={playground}
          scope={{
            React,
            [`${cleanDisplayName(Enhance.displayName)}`]: Enhance,
            domain,
            ...nonDefaultExports
          }}
        />
      </div>
    )
  }
}
