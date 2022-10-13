/* eslint-disable react/prop-types, react/react-in-jsx-scope */
import {renderToString} from 'react-dom/server'

import {expect} from 'chai'

import {render} from '@testing-library/react'

import SUIContext from '@s-ui/react-context'
import {descriptorsByEnvironmentPatcher} from '@s-ui/test/lib/descriptor-environment-patcher'

import {TCF_WINDOW_API} from '../../lib/config.js'
import {useUserConsents} from '../../lib/index.js'
import {tcfApiMock, triggerTcfEvent} from './mocks.js'

descriptorsByEnvironmentPatcher()

const REQUIRED_CONSENTS = [5, 6]
const ALL_CONSENTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const ACCEPTED_CONSENTS_COOKIE =
  'borosTcf=eyJwb2xpY3lWZXJzaW9uIjoyLCJjbXBWZXJzaW9uIjoxNiwicHVycG9zZSI6eyJjb25zZW50cyI6eyIxIjp0cnVlLCIyIjp0cnVlLCIzIjp0cnVlLCI0Ijp0cnVlLCI1Ijp0cnVlLCI2Ijp0cnVlLCI3Ijp0cnVlLCI4Ijp0cnVlLCI5Ijp0cnVlLCIxMCI6dHJ1ZX19LCJzcGVjaWFsRmVhdHVyZXMiOnsiMSI6dHJ1ZX19;'
const REJECTED_CONSENTS_COOKIE =
  'borosTcf=eyJwb2xpY3lWZXJzaW9uIjoyLCJjbXBWZXJzaW9uIjoxNiwicHVycG9zZSI6eyJjb25zZW50cyI6eyIxIjpmYWxzZSwiMiI6ZmFsc2UsIjMiOmZhbHNlLCI0IjpmYWxzZSwiNSI6ZmFsc2UsIjYiOmZhbHNlLCI3IjpmYWxzZSwiOCI6ZmFsc2UsIjkiOmZhbHNlLCIxMCI6ZmFsc2V9fSwic3BlY2lhbEZlYXR1cmVzIjp7IjEiOnRydWV9fQ==;'

const triggerTcfEventFromConsents = consents =>
  triggerTcfEvent({
    eventStatus: 'useractioncomplete',
    purpose: {
      consents: consents.reduce(
        (acc, consentId) => ({...acc, [consentId]: true}),
        {}
      )
    }
  })

const ContextFixtureWrapper = ({value, children}) => {
  return <SUIContext.Provider value={value}>{children}</SUIContext.Provider>
}

function setup(hookArgs, ctxCookiesFixture) {
  const setupRef = {}
  const TestComponent = () => {
    Object.assign(setupRef, {isAccepted: useUserConsents(hookArgs)})
    return null
  }
  const renderFunc = typeof window === 'undefined' ? renderToString : render
  renderFunc(
    <ContextFixtureWrapper value={{cookies: ctxCookiesFixture}}>
      <TestComponent />
    </ContextFixtureWrapper>
  )
  return setupRef
}

describe.server('useUserConsents on server', () => {
  describe("when the user still didn't accept any consent", () => {
    let setupRef

    beforeEach(() => {
      setupRef = setup(REQUIRED_CONSENTS, REJECTED_CONSENTS_COOKIE)
    })

    it('should return that the user has NOT given the required consents', () => {
      expect(setupRef.isAccepted).to.be.false
    })
  })

  describe('when the user accepted all of the consents', () => {
    let setupRef

    beforeEach(() => {
      setupRef = setup(REQUIRED_CONSENTS, ACCEPTED_CONSENTS_COOKIE)
    })

    it('should return that the user has given the required consents', () => {
      expect(setupRef.isAccepted).to.be.true
    })
  })
})

describe.client('useUserConsents on browser', () => {
  before(() => {
    window[TCF_WINDOW_API] = tcfApiMock
  })

  describe("when the user still didn't accept any consent", () => {
    let setupRef

    beforeEach(() => {
      setupRef = setup(REQUIRED_CONSENTS, REJECTED_CONSENTS_COOKIE)
    })

    it('should return that the user has NOT given the required consents', () => {
      expect(setupRef.isAccepted).to.be.false
    })

    describe('but a while later accepts all of them', () => {
      it('should update and return that the user has given the required consents', () => {
        triggerTcfEventFromConsents(ALL_CONSENTS)
        expect(setupRef.isAccepted).to.be.true
      })
    })
    describe('but a while later accepts ONLY the required ones', () => {
      it('should update and return that the user has given the required consents', () => {
        triggerTcfEventFromConsents(REQUIRED_CONSENTS)
        expect(setupRef.isAccepted).to.be.true
      })
    })
    describe('but a while later accepts some of them, including required ones', () => {
      it('should update and return that the user has given the required consents', () => {
        triggerTcfEventFromConsents([1, ...REQUIRED_CONSENTS])
        expect(setupRef.isAccepted).to.be.true
      })
    })
    describe('and a while later accepts some of them, NOT including required ones', () => {
      it('should NOT update and keep returning that the user has NOT given the required consents', () => {
        triggerTcfEventFromConsents(REQUIRED_CONSENTS.slice(1))
        expect(setupRef.isAccepted).to.be.false
      })
    })
  })

  describe('when the user accepted all of the consents', () => {
    let setupRef

    beforeEach(() => {
      setupRef = setup(REQUIRED_CONSENTS, ACCEPTED_CONSENTS_COOKIE)
    })

    it('should return that the user has given the required consents', () => {
      expect(setupRef.isAccepted).to.be.true
    })

    describe('but a while later rejects all of them', () => {
      it('should update and return that the user has NOT given the required consents', () => {
        triggerTcfEventFromConsents([])
        expect(setupRef.isAccepted).to.be.false
      })
    })
    describe('but a while later accepts ONLY the required ones', () => {
      it('should NOT update and keep returning that the user has given the required consents', () => {
        triggerTcfEventFromConsents(REQUIRED_CONSENTS)
        expect(setupRef.isAccepted).to.be.true
      })
    })
    describe('but a while later rejects some of them, including required ones', () => {
      it('should update and return that the user has NOT given the required consents', () => {
        triggerTcfEventFromConsents(REQUIRED_CONSENTS.slice(1))
        expect(setupRef.isAccepted).to.be.false
      })
    })
    describe('and a while later rejects some of them, NOT including required ones', () => {
      it('should NOT update and keep returning that the user has given the required consents', () => {
        triggerTcfEventFromConsents([1, ...REQUIRED_CONSENTS])
        expect(setupRef.isAccepted).to.be.true
      })
    })
  })
})
