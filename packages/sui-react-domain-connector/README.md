# SUI React Domain Connector

## Install

`$ npm install @s-ui/react-domain-connector`

## Usage

```js
// entry.js

import React from 'react'
import {render} from 'react-dom'
import {Provider} from '@s-ui/react-domain-connector'

import Domain from '@schibstedspain/domain'
import Rosetta from '@schibstedspain/rosetta'
import Polyglot from '@schibstedspain/rosetta/lib/adapters/polyglot'

const DEFAULT_CULTURE = 'es-ES'
const DEFAULT_CURRENCY = 'EUR'

const domain = new Domain()
const i18n = new Rosetta({ adapter: new Polyglot() })

i18n.languages = {'es-ES': {}}
i18n.culture = DEFAULT_CULTURE
i18n.currency = DEFAULT_CURRENCY

render(
  <Provider i18n={i18n} domain={domain}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

Or passing directly the store, if you need it outside

```js
// entry.js

import React from 'react'
import {render} from 'react-dom'
import {Provider, createStore} from '@s-ui/react-domain-connector'

import Domain from '@schibstedspain/domain'
import Rosetta from '@schibstedspain/rosetta'
import Polyglot from '@schibstedspain/rosetta/lib/adapters/polyglot'

const DEFAULT_CULTURE = 'es-ES'
const DEFAULT_CURRENCY = 'EUR'

const domain = new Domain()
const i18n = new Rosetta({ adapter: new Polyglot() })

i18n.languages = {'es-ES': {}}
i18n.culture = DEFAULT_CULTURE
i18n.currency = DEFAULT_CURRENCY

const store = createStore(domain)

render(
  <Provider i18n={i18n} store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

Passing Config to your components

```js
// components/Search.js

import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {compose, mapConfigToProps} from '@s-ui/react-domain-connector'

class Search extends Component {
  const {gradesConfig} = this.props
  render () {
    return (
      <div className='Search'>
        <input value={this.state.term} onChange={e => this.setState({term: e.target.value})} />
        <select>
          { gradesConfig.map(grade => <option key={grade} value={grade}>{grade}</option>) }
        </select>
        <button onClick={this.handleSearch}>Search</button>
      </div>
    )
  }

  handleSearch = e => {
    const {listStudentsUseCase} = this.props
    const {term} = this.state
    listStudentsUseCase({term})
  }
}

export default compose(
  mapConfigToProps('grades')
)(Search)
```

Or Using locals HoC to avoid use the global state when you dont need it

```js
import {withLocalService, mapServiceToProps, mapResponseToProps, compose} from '@s-ui/react-domain-connector'

const Home = ({
  history,
  listStudients,
  listStudientsError,
  listStudientsParams,
  listStudientsUseCase
}, {i18n}) => {

  // we control the error, so we render something if we have one
  if (listStudientsError !== undefined) {
    return <h1>Ey! I got this error:<br />{listStudientsError.toString()}</h1>
  }

  // no info yet, call the use case now!
  listStudients === undefined &&
    listStudientsError === undefined && // we have to be sure we don't get a weird loop here!
    listStudientsUseCase()

  return (
    <div className='Home'>
      <Grid images={listStudients} />
      <LoadingOverlay display={listStudients === undefined} />
    </div>
  )
}

Home.displayName = 'Home'
Home.contextTypes = {
  i18n: PropTypes.object
}
Home.propTypes = {
  listStudients: PropTypes.array,
  listStudientsError: PropTypes.any,
  listStudientsParams: PropTypes.object,
  listStudientsUseCase: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func
  })
}

export default withLocalService('list_studients_use_case')(Home)
```

Using UI HoC to manage not relative Domain updates

```js

import {mapUIServiceToProps, mapUIResponseToProps, compose} from '@s-ui/react-domain-connector'

const Home = ({
  history,
  setOfflineUI,
  offlineUI
}, {i18n}) => {

  setTimeout(() => {
    setOfflineUI(true)
  }, 3000)


  // no info yet, call the use case now!
  return (
    <div className='Home'>
      {offlineUI ? 'We are Offline' : 'We are Online'}
    </div>
  )
}

Home.displayName = 'Home'
Home.contextTypes = {
  i18n: PropTypes.object
}
Home.propTypes = {
  offlineUI: PropTypes.bool,
  setOfflineUI: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func
  })
}

export default compose(
  mapUIResponseToProps('offline')
  mapUIServiceToProps('offline')
)('list_studients_use_case')(Home)


```

Comonication between components:

```
import { withLocalService, withStreamService, compose } from '@s-ui/react-domain-connector'

class Home extends PureComponent {
  static displayName = 'Home'
  static contextTypes = {
    i18n: PropTypes.object
  }
  static propTypes = {
    listStudients$: PropTypes.array,
    listStudients$Error: PropTypes.object,
    listStudients: PropTypes.array,
    listStudientsLoading: PropTypes.bool,
    listStudientsCalled: PropTypes.bool,
    listStudientsUseCase: PropTypes.func,
    history: PropTypes.shape({
      push: PropTypes.func
    })
  }

  componentDidMount () {
    const {
      listStudientsCalled,
      listStudientsUseCase
    } = this.props

    !listStudientsCalled &&
    listStudientsUseCase()
  }

  render () {
    const {
      history,
      listStudients$,
      listStudients$Error
    } = this.props
    const {i18n} = this.context

    if (listStudients$Error !== undefined) {
      return <h1>Ey! I got this error:<br />{listStudients$Error.toString()}</h1>
    }

    return (
      <div className='Home'>
        <AppCanvas scrollingTechniques>
          <AppBar title={i18n.t('TITLE')} showMenuIconButton={false} />
          <Content>
            <div className='Home-SearchWrapper'><Search /></div>
            <div className='Home-GridWrapper'><Grid images={listStudients$} /></div>
            <div className='Home-FAVWrapper'><FAVMenu onClickItem={({item}) => {
              const path = item === FAVMenu.ITEMS.SINGLE ? '/create/single' : '/create/multiples'
              history.push(path)
            }} /></div>
          </Content>
        </AppCanvas>
        <LoadingOverlay display={listStudients$ === undefined} />
      </div>
    )
  }
}

export default compose(
  withLocalService('list_studients_use_case'),
  withStreamService('list_studients_use_case')
)(Home)
```
