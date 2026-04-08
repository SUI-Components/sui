import {useContext, useEffect, useRef} from 'react'

import PropTypes from 'prop-types'
import * as cwv from 'web-vitals/attribution'

import SUIContext from '@s-ui/react-context'
import useMount from '@s-ui/react-hooks/lib/useMount/index.js'
import {useRouter} from '@s-ui/react-router'

export const METRICS = {
  CLS: 'CLS',
  FCP: 'FCP',
  INP: 'INP',
  LCP: 'LCP',
  TTFB: 'TTFB'
}

const INP_SUBPARTS = {
  ID: 'ID',
  PT: 'PT',
  PD: 'PD'
}

/**
https://web.dev/articles/optimize-lcp#optimal_sub-part_times
Largest Contentful Paint (LCP) image subparts
- TTFB: Time to First Byte
- RLDE: Resource Load Delay
- RLDU: Resource Load Duration
- ERDE: Element Render Delay
*/
const LCP_SUBPARTS = {
  TTFB: 'LCP_TTFB',
  RLDE: 'LCP_RLDE',
  RLDU: 'LCP_RLDU',
  ERDE: 'LCP_ERDE'
}

// https://github.com/GoogleChrome/web-vitals#metric
const RATING = {
  GOOD: 'good',
  NEEDS_IMPROVEMENT: 'needs-improvement',
  POOR: 'poor'
}

const DEFAULT_METRICS_REPORTING_ALL_CHANGES = [METRICS.CLS, METRICS.INP, METRICS.LCP]

export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile'
}

const BLINK_BROWSERS = new Set([
  'Brave',
  'Chrome',
  'Chrome Headless',
  'Chromium',
  'Facebook',
  'MIUI Browser',
  'UCBrowser',
  'Edge' // Only Chromium-based Edge (v79+) uses Blink, but older versions are EOL
])
const WEBKIT_BROWSERS = new Set(['Android Browser', 'GSA', 'khtml', 'Mobile Safari', 'Safari', 'webkit'])
const GECKO_BROWSERS = new Set(['Firefox', 'Mozilla'])

/**
 * getBrowserEngine determines the browser engine based on the browser name and version, with special handling for iOS and Edge. The order of checks is important to correctly identify the engine:
 * - iOS browsers are always classified as WebKit due to Apple's requirements, regardless of their reported name.
 * - WebKit browsers are identified by checking if their name is in the WEBKIT_BROWSERS set.
 * - Gecko browsers are identified by checking if their name is in the GECKO_BROWSERS set.
 * - Blink browsers are identified by checking if their name ends with 'WebView' (common for Android WebViews) or if their name is in the BLINK_BROWSERS set.
 * - If none of the above conditions are met, the browser engine is classified as 'Other'.
 */
const getBrowserEngine = ({name, isIOS}) => {
  if (isIOS || WEBKIT_BROWSERS.has(name)) return 'WebKit'
  if (GECKO_BROWSERS.has(name)) return 'Gecko'
  if (name?.endsWith('WebView') || BLINK_BROWSERS.has(name)) return 'Blink'
  return 'Other'
}

export default function WebVitalsReporter({
  reporter = cwv,
  children = null,
  deviceType,
  metrics = Object.values(METRICS),
  metricsAllChanges = DEFAULT_METRICS_REPORTING_ALL_CHANGES,
  onReport,
  allowed = []
}) {
  const {logger, browser} = useContext(SUIContext)
  const router = useRouter()
  const {routes} = router
  const route = routes[routes.length - 1]
  const onReportRef = useRef(onReport)

  useEffect(() => {
    onReportRef.current = onReport
  }, [onReport])

  useMount(() => {
    const {deviceMemory, connection: {effectiveType} = {}, hardwareConcurrency} = window.navigator || {}
    const browserEngine = getBrowserEngine(browser || {})

    const getRouteid = () => {
      return route?.id
    }

    const getPathname = route => {
      return route?.path || route?.regexp?.toString().replace(/[^a-z0-9]/gi, '')
    }

    const getDeviceType = () => {
      return deviceType || browser?.deviceType
    }

    const getTarget = ({name, attribution}) => {
      switch (name) {
        case METRICS.CLS:
          return attribution.largestShiftTarget
        case METRICS.LCP:
          return attribution.target
        default:
          return attribution.interactionTarget
      }
    }

    const handleAllChanges = ({attribution, name, rating, value}) => {
      const amount = name === METRICS.CLS ? value * 1000 : value
      const pathname = getPathname(route)
      const routeid = getRouteid()
      const isAllowed = allowed.includes(pathname) || allowed.includes(routeid)
      const target = getTarget({name, attribution})

      if (!isAllowed || !logger?.cwv || rating === RATING.GOOD) return

      const {loadState, interactionType} = attribution

      logger.cwv({
        name: `cwv.${name.toLowerCase()}`,
        amount,
        path: pathname,
        target,
        visibilityState: document.visibilityState,
        ...(routeid && {routeId: routeid}),
        ...(loadState && {loadState}),
        ...(interactionType && {eventType: interactionType}),
        ...(deviceMemory && {deviceMemory}),
        ...(effectiveType && {effectiveType}),
        ...(hardwareConcurrency && {hardwareConcurrency})
      })
    }

    const handleChange = ({name, value, entries, attribution}) => {
      const onReport = onReportRef.current
      const pathname = getPathname(route)
      const routeid = getRouteid()
      const type = getDeviceType()
      const isAllowed = allowed.includes(pathname) || allowed.includes(routeid)

      if (!isAllowed) return

      if (onReport) {
        onReport({
          name,
          amount: value,
          pathname,
          routeid,
          type,
          entries
        })
        return
      }

      if (!logger?.distribution) return

      const amount = name === METRICS.CLS ? value * 1000 : value
      const tags = [
        ...(routeid
          ? [
              {
                key: 'routeid',
                value: routeid
              }
            ]
          : [
              {
                key: 'pathname',
                value: pathname
              }
            ]),
        ...(type
          ? [
              {
                key: 'type',
                value: type
              }
            ]
          : []),
        {
          key: 'browserEngine',
          value: browserEngine
        }
      ]

      // Log the main metric
      logger.distribution({
        name: 'cwv',
        amount,
        tags: [
          {
            key: 'name',
            value: name.toLowerCase()
          },
          ...tags
        ]
      })

      // Process and log Metric subparts from a metrics object
      const processMetricSubparts = metrics => {
        Object.keys(metrics).forEach(name => {
          // Only log if we have a non-zero value
          if (metrics[name] > 0) {
            logger.distribution({
              name: 'cwv',
              amount: metrics[name],
              tags: [
                {
                  key: 'name',
                  value: name.toLowerCase()
                },
                ...tags
              ]
            })
          }
        })
      }

      // Handle INP subparts
      if (name === METRICS.INP) {
        // Helper function to create INP subpart metrics from an object
        const extractINPSubparts = source => {
          return {
            [INP_SUBPARTS.ID]: Math.round(source.inputDelay || 0, 0),
            [INP_SUBPARTS.PT]: Math.round(source.processingDuration || 0, 0),
            [INP_SUBPARTS.PD]: Math.round(source.presentationDelay || 0, 0)
          }
        }

        if (
          attribution &&
          (attribution.inputDelay || attribution.processingDuration || attribution.presentationDelay)
        ) {
          const metrics = extractINPSubparts(attribution)
          processMetricSubparts(metrics)
        }
      }

      // Handle LCP subparts
      if (name === METRICS.LCP) {
        // Helper function to create LCP subpart metrics from an object
        const extractLCPSubparts = source => {
          return {
            [LCP_SUBPARTS.TTFB]: Math.round(source.timeToFirstByte || 0, 0),
            [LCP_SUBPARTS.RLDE]: Math.round(source.resourceLoadDelay || 0, 0),
            [LCP_SUBPARTS.RLDU]: Math.round(source.resourceLoadDuration || 0, 0),
            [LCP_SUBPARTS.ERDE]: Math.round(source.elementRenderDelay || 0, 0)
          }
        }

        // First check if LCP subparts are in the attribution object
        if (
          attribution &&
          (attribution.timeToFirstByte ||
            attribution.resourceLoadDelay ||
            attribution.resourceLoadDuration ||
            attribution.elementRenderDelay)
        ) {
          const metrics = extractLCPSubparts(attribution)
          processMetricSubparts(metrics)
        }
      }
    }
    metrics
      .filter(metric => !!metric && typeof reporter[`on${metric}`] === 'function')
      .forEach(metric => {
        reporter[`on${metric}`](handleChange)

        if (metricsAllChanges.includes(metric)) {
          reporter[`on${metric}`](handleAllChanges, {reportAllChanges: true})
        }
      })
  })

  return children
}

WebVitalsReporter.propTypes = {
  /**
   * An optional children node
   */
  children: PropTypes.node,
  /**
   * An optional string to identify the device type. Choose between: desktop, tablet and mobile
   */
  deviceType: PropTypes.oneOf(Object.values(DEVICE_TYPES)),
  /**
   * An optional array of core web vitals. Choose between: TTFB, LCP, CLS and INP. Defaults to all.
   */
  metrics: PropTypes.arrayOf(PropTypes.oneOf(Object.values(METRICS))),
  /**
   * An optional array of core web vitals that will report on all changes. Choose between: TTFB, LCP, CLS and INP. Defaults to LCP and INP.
   */
  metricsAllChanges: PropTypes.arrayOf(PropTypes.oneOf(Object.values(METRICS))),
  /**
   * An optional callback to be used to track core web vitals
   */
  onReport: PropTypes.func,
  /**
   * An optional array of pathnames or route ids that you want to track
   */
  allowed: PropTypes.arrayOf(PropTypes.string)
}
