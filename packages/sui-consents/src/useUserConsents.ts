import {useContext, useEffect, useState} from 'react'

import SUIContext from '@s-ui/react-context'

import {TCF_VERSION, TCF_WINDOW_API} from './config'
import hasUserConsents from './hasUserConsents'
import {type Purpose, EventStatus} from './types'

export default function useUserConsents(requiredConsents: number[]): boolean {
  /**
   * Consents acceptance state is inited based on the cookies from the
   * context, so we know the state of consents from the beginning, even
   * in SSR.
   */
  const {cookies}: {cookies: string} = useContext(SUIContext)
  const [areConsentsAccepted, setAreConsentsAccepted] = useState(() => hasUserConsents({requiredConsents, cookies}))

  /**
   * From then on, we listen for TCF events so consents changes
   * can be catched right away, no matter when, and react to them
   * wherever the hook is used.
   */
  useEffect(() => {
    const tcfApi = window[TCF_WINDOW_API]
    if (tcfApi !== undefined) {
      const consentsListener = ({eventStatus, purpose}: {eventStatus: EventStatus; purpose: Purpose}): void => {
        if (eventStatus !== EventStatus.USER_ACTION_COMPLETE) return

        setAreConsentsAccepted(requiredConsents.every(purposeId => Boolean(purpose.consents[purposeId])))
      }
      tcfApi('addEventListener', TCF_VERSION, consentsListener)
      return () => {
        tcfApi('removeEventListener', TCF_VERSION, consentsListener)
      }
    }
  }, [requiredConsents])

  return areConsentsAccepted
}
