/* eslint react/prop-types: 0 */
import React, {createContext} from 'react'

export const contextBuilder = (object = {}) => {
  return createContext(object)
}

const Context = contextBuilder()

export default Context

export const Provider = ({children}) => {
  const context = {mode: undefined, stack: []}
  const setMode = value => {
    context.mode = value
  }
  context.setMode = setMode
  return <Context.Provider value={context}>{children}</Context.Provider>
}
