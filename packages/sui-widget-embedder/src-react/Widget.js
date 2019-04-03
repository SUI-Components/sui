/* eslint-disable */
import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import Context from '@s-ui/react-context'
import {Provider as ProviderLegacy} from '@s-ui/react-domain-connector'

export default function Widget({children, domain, i18n, node: selector}) {
  useEffect(
    function() {
      const node = document.querySelector(selector)

      if (!node) {
        return console.warn(`[Widget] unable find the selector ${selector}`)
      }

      ReactDOM.render(
        <Context.Provider
          value={{
            i18n,
            domain
          }}
        >
          <ProviderLegacy i18n={i18n} domain={domain}>
            {children}
          </ProviderLegacy>
        </Context.Provider>,
        node
      )
    },
    []
  )

  return null
}
