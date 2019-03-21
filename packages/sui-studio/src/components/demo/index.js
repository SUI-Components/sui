/* eslint react/no-multi-comp:0, no-console:0 */

import PropTypes from 'prop-types'
import React, {Component} from 'react'

import {iconClose, iconCode, iconFullScreen, iconFullScreenExit} from '../icons'
import Preview from '../preview'
import Style from '../style'
import When from '../when'

import {tryRequireCore as tryRequire} from '../tryRequire'
import stylesFor, {themesFor} from './fetch-styles'
import CodeEditor from './CodeEditor'
import ContextButtons from './ContextButtons'
import EventsButtons from './EventsButtons'
import ThemesButtons from './ThemesButtons'
import withContext from './HoC/withContext'
import withProvider from './HoC/withProvider'

import {createStore} from '@s-ui/react-domain-connector'
import SUIContext from '@s-ui/react-context'

import {
  createContextByType,
  checkIfPackageHasProvider,
  isFunction,
  cleanDisplayName,
  pipe,
  removeDefaultContext
} from './utilities'

const EMPTY = 0
const EVIL_HACK_TO_RERENDER_AFTER_CHANGE = ' '
const CONTAINER_CLASS = 'sui-Studio'
const FULLSCREEN_CLASS = 'sui-Studio--fullscreen'

export default class Demo extends Component {
  static async bootstrapWith(demo, {category, component, style, themes}) {
    const [
      exports,
      playground,
      ctxt,
      events,
      pkg,
      DemoComponent
    ] = await tryRequire({
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
      ctxt: context,
      DemoComponent
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

  _loadStyles({category, component}) {
    stylesFor({category, component}).then(style => {
      const themes = themesFor({category, component})
      Demo.bootstrapWith(this, {category, component, style, themes})
    })
  }

  componentDidMount() {
    this._loadStyles(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    this._loadStyles(nextProps.params)
  }

  componentWillUnmount() {
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

  render() {
    let {
      ctxt = {},
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
      themeSelectedIndex,
      DemoComponent
    } = this.state

    const Base = exports.default

    if (!Base) {
      return <h1>Loading...</h1>
    }

    // check if is a normal component or it's wrapped with a React.memo method
    const ComponentToRender = Base.type ? Base.type : Base

    const nonDefaultExports = removeDefaultContext(exports)
    const context =
      Object.keys(ctxt).length !== EMPTY && createContextByType(ctxt, ctxtType)
    const {domain} = context || {}
    const hasProvider = checkIfPackageHasProvider(pkg)
    const store = domain && hasProvider && createStore(domain)

    const Enhance = pipe(
      withContext(context, context),
      withProvider(hasProvider, store)
    )(ComponentToRender)

    const EnhanceDemoComponent =
      DemoComponent &&
      pipe(
        withContext(context, context),
        withProvider(hasProvider, store)
      )(DemoComponent)

    !Enhance.displayName &&
      console.error(new Error('Component.displayName must be defined.'))

    return (
      <div className="sui-StudioDemo">
        <Style>{style}</Style>
        <div className="sui-StudioNavBar-secondary">
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

        <button
          className="sui-StudioDemo-fullScreenButton"
          onClick={this.handleFullScreen}
        >
          {isFullScreen ? iconFullScreenExit : iconFullScreen}
        </button>

        <When value={!EnhanceDemoComponent && playground}>
          {() => (
            <React.Fragment>
              <button
                className="sui-StudioDemo-codeButton"
                onClick={this.handleCode}
              >
                {isCodeOpen ? iconClose : iconCode}
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
                  context,
                  React,
                  [`${cleanDisplayName(Enhance.displayName)}`]: Enhance,
                  domain,
                  ...nonDefaultExports
                }}
              />
            </React.Fragment>
          )}
        </When>

        <When value={EnhanceDemoComponent}>
          {() => (
            <SUIContext.Provider value={context}>
              <EnhanceDemoComponent />
            </SUIContext.Provider>
          )}
        </When>
      </div>
    )
  }
}
