import {combineReducers} from 'redux'

const ui = (state = {}, action) => {
  if (action.type === 'UI') {
    return {...state, ...action.payload}
  }

  return state
}

const reducers = () => combineReducers({ui})

export default reducers
