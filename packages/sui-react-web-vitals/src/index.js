import {useContext, useEffect, useRef} from 'react'

import PropTypes from 'prop-types'
import * as cwv from 'web-vitals/attribution'

import SUIContext from '@s-ui/react-context'
import useMount from '@s-ui/react-hooks/lib/useMount/index.js'
import {useRouter} from '@s-ui/react-router'

export const METRICS = {
  CLS: 'CLS',
  FCP: 'FCP',
  FID: 'FID',
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

const DEFAULT_METRICS_REPORTING_ALL_CHANGES = [METRICS.CLS, METRICS.FID, METRICS.INP, METRICS.LCP]

export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile'
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
          return attribution.element
        default:
          return attribution.eventTarget || attribution.interactionTarget
      }
    }

    const computeINPSubparts = entry => {
      // RenderTime is an estimate because duration is rounded and may get rounded down.
      // In rare cases, it can be less than processingEnd and that breaks performance.measure().
      // Let's ensure it's at least 4ms in those cases so you can barely see it.
      const presentationTime = Math.max(entry.processingEnd + 4, entry.startTime + entry.duration)

      return {
        [INP_SUBPARTS.ID]: Math.round(entry.processingStart - entry.startTime, 0),
        [INP_SUBPARTS.PT]: Math.round(entry.processingEnd - entry.processingStart, 0),
        [INP_SUBPARTS.PD]: Math.round(presentationTime - entry.processingEnd, 0)
      }
    }

    const handleAllChanges = ({attribution, name, rating, value}) => {
      const amount = name === METRICS.CLS ? value * 1000 : value
      const pathname = getPathname(route)
      const routeid = getRouteid()
      const isAllowed = allowed.includes(pathname) || allowed.includes(routeid)
      const target = getTarget({name, attribution})

      if (!isAllowed || !logger?.cwv || rating === RATING.GOOD) return

      const {loadState, eventType} = attribution

      logger.cwv({
        name: `cwv.${name.toLowerCase()}`,
        amount,
        path: pathname,
        target,
        visibilityState: document.visibilityState,
        ...(routeid && {routeId: routeid}),
        ...(loadState && {loadState}),
        ...(eventType && {eventType}),
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
          : [])
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

      // Handle INP subparts
      if (name === METRICS.INP && entries) {
        entries.forEach(entry => {
          const metrics = computeINPSubparts(entry)

          Object.keys(metrics).forEach(name => {
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
          })
        })
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

        // Process and log LCP subparts from a metrics object
        const processLCPSubparts = metrics => {
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

        // First check if LCP subparts are in the attribution object
        if (
          attribution &&
          (attribution.timeToFirstByte ||
            attribution.resourceLoadDelay ||
            attribution.resourceLoadDuration ||
            attribution.elementRenderDelay)
        ) {
          const metrics = extractLCPSubparts(attribution)
          processLCPSubparts(metrics)
        }

        // Then check entries as before
        if (entries && entries.length > 0) {
          entries.forEach(entry => {
            if (
              entry &&
              (entry.timeToFirstByte ||
                entry.resourceLoadDelay ||
                entry.resourceLoadDuration ||
                entry.elementRenderDelay)
            ) {
              const metrics = extractLCPSubparts(entry)
              processLCPSubparts(metrics)
            }
          })
        }
      }
    }
    metrics.forEach(metric => {
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
   * An optional array of core web vitals. Choose between: TTFB, LCP, FID, CLS and INP. Defaults to all.
   */
  metrics: PropTypes.arrayOf(PropTypes.oneOf(Object.values(METRICS))),
  /**
   * An optional array of core web vitals that will report on all changes. Choose between: TTFB, LCP, FID, CLS and INP. Defaults to LCP and INP.
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
