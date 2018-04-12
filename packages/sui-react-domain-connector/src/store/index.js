import {createStore as reduxCreateStore} from 'redux'

import reducers from './reducers'

const createStore = () =>
  reduxCreateStore(
    reducers(),
    typeof window !== 'undefined' &&
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
  )

export default createStore
