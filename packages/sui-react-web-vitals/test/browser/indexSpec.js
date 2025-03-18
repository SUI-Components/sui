import {expect} from 'chai'
import sinon from 'sinon'

import {render as wrap, screen, waitFor} from '@testing-library/react'

import SUIContext from '@s-ui/react-context'
import {Route, Router} from '@s-ui/react-router'
import createMemoryHistory from '@s-ui/react-router/lib/createMemoryHistory.js'

import WebVitalsReporter, {METRICS} from '../../src/index.js'

const render = (children, options = {}) => {
  const {logger, browser, routeId} = options

  const props = wrap(
    <Router history={createMemoryHistory()}>
      <Route
        path="/"
        id={routeId}
        component={() => <SUIContext.Provider value={{logger, browser}}>{children}</SUIContext.Provider>}
      />
    </Router>
  )

  return {...props, ...options}
}

describe('WebVitalsReporter', () => {
  it('should render content', async () => {
    render(
      <WebVitalsReporter>
        <h1>Title</h1>
      </WebVitalsReporter>
    )

    await screen.findByRole('heading', {name: 'Title'})
  })

  it('should track cwv using callback', async () => {
    const reporter = {
      onINP: fn => {
        fn({name: 'TTFB', value: 10})
      }
    }
    const onReport = sinon.spy()

    render(<WebVitalsReporter metrics={[METRICS.INP]} allowed={['/']} reporter={reporter} onReport={onReport} />)

    await waitFor(() => [expect(onReport.calledWithMatch({name: 'TTFB', amount: 10, pathname: '/'})).to.be.true])
  })

  it('should track cwv using callback with route id', async () => {
    const reporter = {
      onINP: fn => {
        fn({name: 'TTFB', value: 10})
      }
    }
    const onReport = sinon.spy()
    const routeId = 'home'

    render(<WebVitalsReporter metrics={[METRICS.INP]} allowed={['/']} reporter={reporter} onReport={onReport} />, {
      routeId
    })

    await waitFor(() => [
      expect(onReport.calledWithMatch({name: 'TTFB', amount: 10, pathname: '/', routeid: routeId})).to.be.true
    ])
  })

  it('should track cwv using callback with browser', async () => {
    const reporter = {
      onINP: fn => {
        fn({name: 'TTFB', value: 10})
      }
    }
    const onReport = sinon.spy()
    const deviceType = 'mobile'

    render(
      <WebVitalsReporter
        metrics={[METRICS.INP]}
        allowed={['/']}
        reporter={reporter}
        deviceType={deviceType}
        onReport={onReport}
      />
    )

    await waitFor(() => [
      expect(onReport.calledWithMatch({name: 'TTFB', amount: 10, pathname: '/', type: deviceType})).to.be.true
    ])
  })

  it('should track cwv using callback with browser in context', async () => {
    const reporter = {
      onINP: fn => {
        fn({name: 'TTFB', value: 10})
      }
    }
    const onReport = sinon.spy()
    const deviceType = 'mobile'
    const browser = {deviceType}

    render(<WebVitalsReporter metrics={[METRICS.INP]} allowed={['/']} reporter={reporter} onReport={onReport} />, {
      browser
    })

    await waitFor(() => [
      expect(onReport.calledWithMatch({name: 'TTFB', amount: 10, pathname: '/', type: deviceType})).to.be.true
    ])
  })

  it('should track cwv using logger distribution', async () => {
    const logger = {
      distribution: sinon.spy()
    }
    const reporter = {
      onTTFB: fn => {
        fn({name: 'TTFB', value: 10})
      }
    }

    render(<WebVitalsReporter metrics={[METRICS.TTFB]} allowed={['/']} reporter={reporter} />, {logger})

    await waitFor(() => [
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 10,
          tags: [
            {key: 'name', value: 'ttfb'},
            {key: 'pathname', value: '/'}
          ]
        })
      ).to.be.true
    ])
  })

  it('should track cwv using logger distribution with route id', async () => {
    const logger = {
      distribution: sinon.spy()
    }
    const reporter = {
      onTTFB: fn => {
        fn({name: 'TTFB', value: 10})
      }
    }
    const routeId = 'home'

    render(<WebVitalsReporter metrics={[METRICS.TTFB]} allowed={['/']} reporter={reporter} />, {logger, routeId})

    await waitFor(() => [
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 10,
          tags: [
            {key: 'name', value: 'ttfb'},
            {key: 'routeid', value: routeId}
          ]
        })
      ).to.be.true
    ])
  })

  it('should track cwv using logger distribution with browser', async () => {
    const logger = {
      distribution: sinon.spy()
    }
    const reporter = {
      onTTFB: fn => {
        fn({name: 'TTFB', value: 10})
      }
    }
    const deviceType = 'mobile'

    render(<WebVitalsReporter metrics={[METRICS.TTFB]} allowed={['/']} reporter={reporter} deviceType={deviceType} />, {
      logger
    })

    await waitFor(() => [
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 10,
          tags: [
            {key: 'name', value: 'ttfb'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType}
          ]
        })
      ).to.be.true
    ])
  })

  it('should track TTFB using logger distribution with browser in context', async () => {
    const logger = {
      distribution: sinon.spy()
    }
    const reporter = {
      onTTFB: fn => {
        fn({name: 'TTFB', value: 10})
      }
    }
    const deviceType = 'mobile'
    const browser = {deviceType}

    render(<WebVitalsReporter metrics={[METRICS.TTFB]} allowed={['/']} reporter={reporter} />, {logger, browser})

    await waitFor(() => [
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 10,
          tags: [
            {key: 'name', value: 'ttfb'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType}
          ]
        })
      ).to.be.true
    ])
  })
  it('should track LCP using logger distribution with browser in context', async () => {
    const logger = {
      distribution: sinon.spy()
    }
    const reporter = {
      onLCP: fn => {
        fn({
          name: 'LCP',
          value: 1200,
          entries: [
            {
              timeToFirstByte: 300,
              resourceLoadDelay: 240,
              resourceLoadDuration: 480,
              elementRenderDelay: 180
            }
          ]
        })
      }
    }
    const deviceType = 'mobile'
    const browser = {deviceType}

    render(<WebVitalsReporter metrics={[METRICS.LCP]} allowed={['/']} reporter={reporter} />, {logger, browser})

    await waitFor(() => [
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 1200,
          tags: [
            {key: 'name', value: 'lcp'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 300,
          tags: [
            {key: 'name', value: 'ttfb'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 240,
          tags: [
            {key: 'name', value: 'rlde'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 480,
          tags: [
            {key: 'name', value: 'rldu'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 180,
          tags: [
            {key: 'name', value: 'erde'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType}
          ]
        })
      ).to.be.true
    ])
  })
  it('should track inp using logger distribution', async () => {
    const logger = {
      distribution: sinon.spy()
    }

    const reporter = {
      onINP: fn => {
        fn({name: 'INP', value: 104, entries: [{startTime: 0, processingStart: 50, processingEnd: 100, duration: 5}]})
      }
    }

    render(<WebVitalsReporter metrics={[METRICS.INP]} allowed={['/']} reporter={reporter} />, {logger})

    await waitFor(() => [
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 104,
          tags: [
            {key: 'name', value: 'inp'},
            {key: 'pathname', value: '/'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 50,
          tags: [
            {key: 'name', value: 'id'},
            {key: 'pathname', value: '/'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 50,
          tags: [
            {key: 'name', value: 'pt'},
            {key: 'pathname', value: '/'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 4,
          tags: [
            {key: 'name', value: 'pd'},
            {key: 'pathname', value: '/'}
          ]
        })
      ).to.be.true
    ])
  })

  it.skip('should track inp with deviceMemory, networkConnection, and hardwareConcurrency using logger cwv', async () => {
    // Mocking the visibilityState
    Object.defineProperty(window.document, 'visibilityState', {value: 'hidden', writable: false})

    const logger = {
      cwv: sinon.spy()
    }

    const reporter = {
      onINP: fn => {
        fn({
          attribution: {eventType: 'body'},
          deviceMemory: 8,
          effectiveType: '4g',
          hardwareConcurrency: 10,
          name: 'INP',
          rating: 'poor',
          value: 304
        })
      }
    }

    render(<WebVitalsReporter metrics={[METRICS.INP]} allowed={['/']} reporter={reporter} />, {logger})
    await waitFor(() => [
      expect(
        logger.cwv.calledOnceWithMatch({
          name: 'cwv.inp',
          amount: 304,
          path: '/',
          target: undefined,
          visibilityState: 'hidden',
          eventType: 'body',
          deviceMemory: 8,
          effectiveType: '4g',
          hardwareConcurrency: 10
        })
      ).to.be.true
    ])
  })
})
