# sui-react-domain-conector
> Connect any React component to your domain use cases'

Features:
* Decoupled from domain
* Event sourced domain
* Global state layer
* Avoidance of business rules into reducers



## Installation

```sh
npm install @schibstedspain/sui-react-domain-conector --save-dev
```

## Usage

```js
// entry.js

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'ddd-react-redux'

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

Or passing store directly, if you need to use it outside the tree:

```js
// entry.js

import React from 'react'
import {render} from 'react-dom'
import {Provider, createStore} from 'ddd-react-redux'

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

```js
// page/Home.js

import React from 'react'
import PropTypes from 'prop-types'
import {calls, services, pipe} from 'ddd-react-redux'

const Home = ({
  listStudents,
  listStudentsParams,
  listStudentsUseCase
}) => {
  listStudents === undefined && listStudentsUseCase()
  return (
    <div className='Home'>
      <Search />
      <Grid images={listStudents} />
      <LoadingOverlay display={listStudents === undefined} />
    </div>
  )
}

Home.displayName = 'Home'
Home.propTypes = {
  listStudents: PropTypes.array,
  listStudentsParams: PropTypes.object,
  listStudentsUseCase: PropTypes.func
}

export default pipe(
  calls('list_students_use_case'),
  services('list_students_use_case')
)(Home)

```

```js
// components/Search.js

import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {services, pipe, configs} from 'ddd-react-redux'

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

export default pipe(
  services('list_students_use_case'),
  configs('grades')
)(Search)
```

Or Using locals HoC to avoid use the global state when you dont need it

```js
import {locals, services, calls, pipe} from '@schibstedspain/ddd-react-redux'

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

export default pipe(
  locals('list_studients_use_case')
)(Home)
```

## TODO
- [ ] Gestionar adecuadamente los errores en los [casos de uso](https://github.com/SUI-Components/ddd-react-redux/blob/master/src/store/actions.js#L3)
- [x] Obtener la configuración usando otro HoC. del tipo `export default config('provinces', 'courses')(Search)`
