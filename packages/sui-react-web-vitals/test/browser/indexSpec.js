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
  beforeEach(() => {
    sinon.stub(document, 'visibilityState').value('visible')
    sinon.stub(window.navigator, 'deviceMemory').value(4)
    sinon.stub(window.navigator, 'connection').value({effectiveType: '3g'})
    sinon.stub(window.navigator, 'hardwareConcurrency').value(4)
  })

  afterEach(() => {
    sinon.restore()
  })

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

  it('should not track cwv when path is not in allowed list', async () => {
    const onReport = sinon.spy()
    const reporter = {
      onINP: fn => {
        fn({name: 'INP', value: 10, entries: [], attribution: {}})
      }
    }
    render(<WebVitalsReporter metrics={[METRICS.INP]} allowed={['/other']} reporter={reporter} onReport={onReport} />)
    await waitFor(() => expect(onReport.called).to.be.false)
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

  it('should track cwv using callback with device type', async () => {
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
            {key: 'pathname', value: '/'},
            {key: 'browserEngine', value: 'Other'}
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
            {key: 'routeid', value: routeId},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true
    ])
  })

  it('should track cwv using logger distribution with device type', async () => {
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
            {key: 'type', value: deviceType},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true
    ])
  })
  ;[
    // isIOS forces WebKit regardless of browser name
    ({browser: {name: 'Chrome', isIOS: true}, expectedEngine: 'WebKit'},
    // WEBKIT_BROWSERS set
    {browser: {name: 'Safari'}, expectedEngine: 'WebKit'},
    {browser: {name: 'Mobile Safari'}, expectedEngine: 'WebKit'},
    {browser: {name: 'Android Browser'}, expectedEngine: 'WebKit'},
    {browser: {name: 'GSA'}, expectedEngine: 'WebKit'},
    // GECKO_BROWSERS set
    {browser: {name: 'Firefox'}, expectedEngine: 'Gecko'},
    {browser: {name: 'Mozilla'}, expectedEngine: 'Gecko'},
    // BLINK_BROWSERS set
    {browser: {name: 'Chrome'}, expectedEngine: 'Blink'},
    {browser: {name: 'Edge'}, expectedEngine: 'Blink'},
    {browser: {name: 'Chromium'}, expectedEngine: 'Blink'},
    // name ending in 'WebView'
    {browser: {name: 'AndroidWebView'}, expectedEngine: 'Blink'},
    // unknown name → Other
    {browser: {name: 'UnknownBrowser'}, expectedEngine: 'Other'},
    // no name → Other
    {browser: {}, expectedEngine: 'Other'})
  ].forEach(({browser, expectedEngine}) => {
    it(`should track cwv using logger distribution with browserEngine: ${expectedEngine} for browser "${
      browser.name ?? ''
    }"${browser.isIOS ? ' (isIOS)' : ''}`, async () => {
      const logger = {distribution: sinon.spy()}
      const reporter = {
        onTTFB: fn => {
          fn({name: 'TTFB', value: 10, entries: [], attribution: {}})
        }
      }
      render(<WebVitalsReporter metrics={[METRICS.TTFB]} allowed={['/']} reporter={reporter} />, {logger, browser})
      await waitFor(() => [
        expect(
          logger.distribution.calledWith({
            name: 'cwv',
            amount: 10,
            tags: [
              {key: 'name', value: 'ttfb'},
              {key: 'pathname', value: '/'},
              {key: 'browserEngine', value: expectedEngine}
            ]
          })
        ).to.be.true
      ])
    })
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
            {key: 'type', value: deviceType},
            {key: 'browserEngine', value: 'Other'}
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
          entries: [], // Empty or could be some other entries
          attribution: {
            // Move the sub-parts here
            timeToFirstByte: 300,
            resourceLoadDelay: 240,
            resourceLoadDuration: 480,
            elementRenderDelay: 180,
            element: document.body // Example of another attribution property
          }
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
            {key: 'type', value: deviceType},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 300,
          tags: [
            {key: 'name', value: 'lcp_ttfb'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 240,
          tags: [
            {key: 'name', value: 'lcp_rlde'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 480,
          tags: [
            {key: 'name', value: 'lcp_rldu'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 180,
          tags: [
            {key: 'name', value: 'lcp_erde'},
            {key: 'pathname', value: '/'},
            {key: 'type', value: deviceType},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true
    ])
  })

  it('should track INP using logger distribution', async () => {
    const logger = {
      distribution: sinon.spy()
    }
    const reporter = {
      onINP: fn => {
        fn({
          name: 'INP',
          value: 104,
          entries: [],
          attribution: {
            inputDelay: 50,
            processingDuration: 50,
            presentationDelay: 4,
            interactionTarget: document.body
          }
        })
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
            {key: 'pathname', value: '/'},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 50,
          tags: [
            {key: 'name', value: 'id'},
            {key: 'pathname', value: '/'},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 50,
          tags: [
            {key: 'name', value: 'pt'},
            {key: 'pathname', value: '/'},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true,
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 4,
          tags: [
            {key: 'name', value: 'pd'},
            {key: 'pathname', value: '/'},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true
    ])
  })

  it('should track FCP using logger distribution', async () => {
    const logger = {
      distribution: sinon.spy()
    }
    const reporter = {
      onFCP: fn => {
        fn({name: 'FCP', value: 800, entries: [], attribution: {}})
      }
    }
    render(<WebVitalsReporter metrics={[METRICS.FCP]} allowed={['/']} reporter={reporter} />, {logger})
    await waitFor(() => [
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 800,
          tags: [
            {key: 'name', value: 'fcp'},
            {key: 'pathname', value: '/'},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true
    ])
  })

  it('should track CLS using logger distribution with value multiplied by 1000', async () => {
    const logger = {
      distribution: sinon.spy()
    }
    const reporter = {
      onCLS: fn => {
        fn({name: 'CLS', value: 0.1, entries: [], attribution: {}})
      }
    }
    render(<WebVitalsReporter metrics={[METRICS.CLS]} allowed={['/']} reporter={reporter} />, {logger})
    await waitFor(() => [
      expect(
        logger.distribution.calledWith({
          name: 'cwv',
          amount: 100,
          tags: [
            {key: 'name', value: 'cls'},
            {key: 'pathname', value: '/'},
            {key: 'browserEngine', value: 'Other'}
          ]
        })
      ).to.be.true
    ])
  })

  it('should track CLS using logger with route id, load state, device memory, network connection, and hardware concurrency', async () => {
    const logger = {
      cwv: sinon.spy()
    }
    const reporter = {
      onCLS: fn => {
        fn({
          name: 'CLS',
          value: 0.1,
          entries: [],
          attribution: {
            loadState: 'complete',
            largestShiftTarget: document.body
          }
        })
      }
    }
    const routeId = 'home'

    render(<WebVitalsReporter metrics={[METRICS.CLS]} allowed={['/']} reporter={reporter} />, {logger, routeId})
    await waitFor(() => [
      expect(
        logger.cwv.calledWithMatch({
          name: 'cwv.cls',
          amount: 100,
          path: '/',
          target: document.body,
          visibilityState: 'visible',
          routeId,
          loadState: 'complete',
          eventType: undefined,
          deviceMemory: 4,
          effectiveType: '3g',
          hardwareConcurrency: 4
        })
      ).to.be.true
    ])
  })

  it('should track LCP using logger with route id, load state, device memory, network connection, and hardware concurrency', async () => {
    const logger = {
      cwv: sinon.spy()
    }
    const reporter = {
      onLCP: fn => {
        fn({
          name: 'LCP',
          value: 1200,
          attribution: {
            loadState: 'complete',
            target: document.body
          }
        })
      }
    }
    const routeId = 'home'

    render(<WebVitalsReporter metrics={[METRICS.LCP]} allowed={['/']} reporter={reporter} />, {logger, routeId})
    await waitFor(() => [
      expect(
        logger.cwv.calledWithMatch({
          name: 'cwv.lcp',
          amount: 1200,
          path: '/',
          target: document.body,
          visibilityState: 'visible',
          routeId,
          loadState: 'complete',
          eventType: undefined,
          deviceMemory: 4,
          effectiveType: '3g',
          hardwareConcurrency: 4
        })
      ).to.be.true
    ])
  })

  it('should track INP using logger with route id, interaction type, device memory, network connection, and hardware concurrency', async () => {
    const logger = {
      cwv: sinon.spy()
    }
    const reporter = {
      onINP: fn => {
        fn({
          name: 'INP',
          value: 104,
          attribution: {
            loadState: 'complete',
            interactionType: 'pointer',
            interactionTarget: document.body
          }
        })
      }
    }
    const routeId = 'home'

    render(<WebVitalsReporter metrics={[METRICS.INP]} allowed={['/']} reporter={reporter} />, {logger, routeId})
    await waitFor(() => [
      expect(
        logger.cwv.calledWithMatch({
          name: 'cwv.inp',
          amount: 104,
          path: '/',
          target: document.body,
          visibilityState: 'visible',
          routeId,
          loadState: 'complete',
          eventType: 'pointer',
          deviceMemory: 4,
          effectiveType: '3g',
          hardwareConcurrency: 4
        })
      ).to.be.true
    ])
  })

  it('should not track cwv using logger cwv when rating is good', async () => {
    const logger = {
      cwv: sinon.spy()
    }
    const reporter = {
      onINP: fn => {
        fn({
          name: 'INP',
          value: 50,
          rating: 'good',
          attribution: {
            interactionType: 'pointer',
            loadState: 'dom-interactive'
          }
        })
      }
    }
    render(<WebVitalsReporter metrics={[METRICS.INP]} allowed={['/']} reporter={reporter} />, {logger})
    await waitFor(() => expect(logger.cwv.called).to.be.false)
  })
})
