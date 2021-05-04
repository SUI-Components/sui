/* eslint react/no-multi-comp:0, no-console:0 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import SUIContext from '@s-ui/react-context'
import {withRouter} from '@s-ui/react-router'

import {iconClose, iconCode, iconFullScreen, iconFullScreenExit} from '../icons'
import Preview from '../preview'
import Style from '../style'

import {importMainModules, fetchPlayground} from '../tryRequire'
import stylesFor, {themesFor} from './fetch-styles'
import CodeEditor from './CodeEditor'
import ContextButtons from './ContextButtons'
import EventsButtons from './EventsButtons'
import ThemesButtons from './ThemesButtons'

import {
  createContextByType,
  isFunction,
  cleanDisplayName,
  removeDefaultContext
} from './utilities'

const EVIL_HACK_TO_RERENDER_AFTER_CHANGE = ' '
const CONTAINER_CLASS = 'sui-Studio'
const FULLSCREEN_CLASS = 'sui-Studio--fullscreen'

class Demo extends Component {
  state = {
    ctxt: false,
    exports: false,
    isCodeOpen: false,
    isFullScreen: false,
    playground: undefined,
    themes: []
  }

  _init({
    category,
    component,
    actualStyle = 'default',
    actualContext = 'default'
  }) {
    this.setState({
      // clean state in case we're moving from another component
      exports: {default: null}
    })

    Promise.all([
      stylesFor({category, component, withTheme: actualStyle}),
      importMainModules({category, component}),
      fetchPlayground({category, component})
    ]).then(async ([style, requiredModules, playground]) => {
      const [exports, ctxt, events, DemoComponent] = requiredModules
      const themes = themesFor({category, component})
      const context = isFunction(ctxt) ? await ctxt() : ctxt // context could be a Promise, and we should wait for it

      this.setState({
        ctxt: context,
        DemoComponent,
        events,
        exports,
        playground,
        style,
        themes
      })
    })
  }

  componentDidMount() {
    const {
      params,
      router: {
        location: {query}
      }
    } = this.props
    this._init({...params, ...query})
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps({
    params,
    router: {
      location: {query}
    }
  }) {
    this._init({...params, ...query})
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

  handleContextChange = actualContext => {
    const {router} = this.props
    const {pathname, query} = this.props.router.location
    this.setState({
      playground: this.state.playground + EVIL_HACK_TO_RERENDER_AFTER_CHANGE
    })
    router.push({pathname, query: {...query, actualContext}})
  }

  handleThemeChange = actualStyle => {
    const {router} = this.props
    const {pathname, query} = this.props.router.location
    const {category, component} = this.props.params
    stylesFor({category, component, withTheme: actualStyle}).then(style => {
      this.setState({
        style
      })
    })
    router.push({pathname, query: {...query, actualStyle}})
  }

  render() {
    const {
      ctxt = {},
      DemoComponent,
      events,
      exports,
      isCodeOpen,
      isFullScreen,
      playground,
      style,
      themes
    } = this.state

    const {actualContext = 'default'} = this.props.router.location.query

    const {default: Base} = exports

    if (!Base) return null

    // check if is a normal component or it's wrapped with a React.memo method
    const ComponentToRender = Base.type ? Base.type : Base

    const nonDefaultExports = removeDefaultContext(exports)
    const context =
      Object.keys(ctxt).length && createContextByType(ctxt, actualContext)
    const {domain} = context || {}

    !ComponentToRender.displayName &&
      console.error(new Error('Component.displayName must be defined.'))

    return (
      <div className="sui-StudioDemo">
        <Style id="sui-studio-demo-style">{style}</Style>
        <div className="sui-StudioNavBar-secondary">
          <ContextButtons
            ctxt={ctxt || {}}
            onContextChange={this.handleContextChange}
          />
          <ThemesButtons
            themes={themes}
            onThemeChange={this.handleThemeChange}
          />
          <EventsButtons events={events || {}} domain={domain} />
        </div>

        <button
          className="sui-StudioDemo-fullScreenButton"
          onClick={this.handleFullScreen}
        >
          {isFullScreen ? iconFullScreenExit : iconFullScreen}
        </button>

        {!DemoComponent && playground && (
          <>
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
                [cleanDisplayName(
                  ComponentToRender.displayName
                )]: ComponentToRender,
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
  router: PropTypes.object,
  params: PropTypes.shape({
    category: PropTypes.string,
    component: PropTypes.string
  })
}

export default withRouter(Demo)
