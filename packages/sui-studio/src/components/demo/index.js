/* eslint react/no-multi-comp:0, no-console:0 */
import React, {Component} from 'react'

import PropTypes from 'prop-types'

import SUIContext from '@s-ui/react-context'

import {iconClose, iconCode, iconFullScreen, iconFullScreenExit} from '../icons/index.js'
import Preview from '../preview/index.js'
import Style from '../style/index.js'
import {fetchPlayground, importMainModules} from '../tryRequire.js'
import CodeEditor from './CodeEditor.js'
import ContextButtons from './ContextButtons.js'
import stylesFor, {themesFor} from './fetch-styles.js'
import ThemesButtons from './ThemesButtons.js'
import {cleanDisplayName, createContextByType, isFunction, removeDefaultContext} from './utilities.js'

const EVIL_HACK_TO_RERENDER_AFTER_CHANGE = ' '
const CONTAINER_CLASS = 'sui-Studio'
const FULLSCREEN_CLASS = 'sui-Studio--fullscreen'

export default class Demo extends Component {
  state = {
    ctxt: false,
    ctxtSelectedIndex: 0,
    ctxtType: 'default',
    exports: false,
    isCodeOpen: false,
    isFullScreen: false,
    playground: undefined,
    theme: 'default',
    themes: [],
    themeSelectedIndex: 0
  }

  _init({category, component, theme}) {
    this.setState({
      // clean state in case we're moving from another component
      exports: {default: null}
    })

    Promise.all([
      stylesFor({category, component, withTheme: theme}),
      importMainModules({category, component}),
      fetchPlayground({category, component})
    ]).then(async ([style, requiredModules, playground]) => {
      const [exports, ctxt, DemoComponent] = requiredModules
      const themes = themesFor({category, component})
      const context = isFunction(ctxt) ? await ctxt() : ctxt // context could be a Promise, and we should wait for it

      this.setState({
        ctxt: context,
        DemoComponent,
        exports,
        playground,
        style,
        themes
      })
    })
  }

  componentDidMount() {
    this._init(this.props.params)
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    this._init({...nextProps.params, theme: this.state.theme})
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
      this.containerClassList = this.containerClassList || document.getElementsByClassName(CONTAINER_CLASS)[0].classList

      isFullScreen ? this.containerClassList.add(FULLSCREEN_CLASS) : this.containerClassList.remove(FULLSCREEN_CLASS)
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
    const {
      ctxt = {},
      ctxtSelectedIndex,
      ctxtType,
      DemoComponent,
      exports,
      isCodeOpen,
      isFullScreen,
      playground,
      style,
      themes,
      themeSelectedIndex
    } = this.state

    const {default: Base} = exports

    if (!Base) return null

    // check if is a normal component or it's wrapped with a React.memo method
    const ComponentToRender = Base.type ? Base.type : Base

    const nonDefaultExports = removeDefaultContext(exports)
    const context = Object.keys(ctxt).length && createContextByType(ctxt, ctxtType)
    const {domain} = context || {}

    !ComponentToRender.displayName && console.error(new Error('Component.displayName must be defined.'))

    return (
      <div className="sui-StudioDemo">
        <Style id="sui-studio-demo-style">{style}</Style>
        <div className="sui-StudioNavBar-secondary">
          <ContextButtons ctxt={ctxt || {}} selected={ctxtSelectedIndex} onContextChange={this.handleContextChange} />
          <ThemesButtons themes={themes} selected={themeSelectedIndex} onThemeChange={this.handleThemeChange} />
        </div>

        <button
          className="sui-StudioDemo-fullScreenButton"
          onClick={this.handleFullScreen}
          aria-label={isFullScreen ? 'see in full screen' : 'close full screen mode'}
        >
          {isFullScreen ? iconFullScreenExit : iconFullScreen}
        </button>

        {!DemoComponent && playground && (
          <>
            <button className="sui-StudioDemo-codeButton" onClick={this.handleCode}>
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
                [cleanDisplayName(ComponentToRender.displayName)]: ComponentToRender,
                domain,
                ...nonDefaultExports
              }}
            />
          </>
        )}

        {DemoComponent && (
          <SUIContext.Provider value={context}>
            <DemoComponent />
          </SUIContext.Provider>
        )}
      </div>
    )
  }
}

Demo.propTypes = {
  category: PropTypes.string,
  component: PropTypes.string,
  params: PropTypes.shape({
    category: PropTypes.string,
    component: PropTypes.string
  })
}
