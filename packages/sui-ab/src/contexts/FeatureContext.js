import React from 'react'

const features =
  typeof window !== 'undefined' ? window.__INITIAL_FEATURES__ || [] : []

export default React.createContext({features})
