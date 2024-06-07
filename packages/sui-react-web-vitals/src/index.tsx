/* eslint @typescript-eslint/strict-boolean-expressions:0 */
/* eslint @typescript-eslint/no-non-null-assertion:0 */
import React, {useContext, useEffect, useRef} from 'react'

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
} as const

const INP_METRICS = {
  ID: 'ID',
  PT: 'PT',
  PD: 'PD'
}

// https://github.com/GoogleChrome/web-vitals#metric
const RATING = {
  GOOD: 'good',
  NEEDS_IMPROVEMENT: 'needs-improvement',
  POOR: 'poor'
} as const

const DEFAULT_METRICS_REPORTING_ALL_CHANGES = [METRICS.CLS, METRICS.FID, METRICS.INP, METRICS.LCP] as const

export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile'
} as const

type DeviceType = typeof DEVICE_TYPES[keyof typeof DEVICE_TYPES]
type Metric = typeof METRICS[keyof typeof METRICS]
interface Route {
  id?: string
  path?: string
  regexp?: RegExp
}

interface Attribution {
  largestShiftTarget?: Element
  element?: Element
  eventTarget?: Element
  loadState?: string
  eventType?: string
}

interface MetricReport {
  name: string
  value: number
  attribution: Attribution
  rating: typeof RATING[keyof typeof RATING]
}

interface WebVitalsReporterProps extends React.PropsWithChildren {
  reporter: typeof cwv
  deviceType: DeviceType
  metrics: Metric[]
  metricsAllChanges: typeof DEFAULT_METRICS_REPORTING_ALL_CHANGES
  onReport: (args: {
    name: string
    amount: number
    pathname: string
    routeid: string
    type: string
    entries: PerformanceEntry[]
  }) => void
  allowed: string[]
}

export default function WebVitalsReporter({
  reporter = cwv,
  children = null,
  deviceType,
  metrics = Object.values(METRICS),
  metricsAllChanges = DEFAULT_METRICS_REPORTING_ALL_CHANGES,
  onReport,
  allowed = []
}: WebVitalsReporterProps) {
  const {logger, browser} = useContext(SUIContext)
  const router = useRouter()
  const {routes} = router
  const route = routes[routes.length - 1]
  const onReportRef = useRef(onReport)

  useEffect(() => {
    onReportRef.current = onReport
  }, [onReport])

  useMount(() => {
    const {
      deviceMemory,
      connection: {effectiveType} = {effectiveType: ''},
      hardwareConcurrency
    } = window.navigator ?? {}

    const getRouteid = () => {
      return route?.id
    }

    const getPathname = (route: Route | undefined) => {
      return route?.path ?? route?.regexp?.toString().replace(/[^a-z0-9]/gi, '')
    }

    const getDeviceType = () => {
      return deviceType || browser?.deviceType
    }

    const getTarget = ({name, attribution}: {name: string; attribution: Attribution}) => {
      switch (name) {
        case METRICS.CLS:
          return attribution.largestShiftTarget
        case METRICS.LCP:
          return attribution.element
        default:
          return attribution.eventTarget
      }
    }

    const computeINPMetrics = (entry: PerformanceEntry & {processingStart: number; processingEnd: number}) => {
      // RenderTime is an estimate because duration is rounded and may get rounded down.
      // In rare cases, it can be less than processingEnd and that breaks performance.measure().
      // Let's ensure it's at least 4ms in those cases so you can barely see it.
      const presentationTime = Math.max(entry.processingEnd + 4, entry.startTime + entry.duration)

      return {
        [INP_METRICS.ID]: Math.round(entry.processingStart - entry.startTime),
        [INP_METRICS.PT]: Math.round(entry.processingEnd - entry.processingStart),
        [INP_METRICS.PD]: Math.round(presentationTime - entry.processingEnd)
      }
    }

    const handleAllChanges = ({attribution, name, rating, value}: MetricReport) => {
      const amount = name === METRICS.CLS ? value * 1000 : value
      const pathname = getPathname(route)
      const routeid = getRouteid()
      const isAllowed = allowed.includes(pathname!) || allowed.includes(routeid)
      const target = getTarget({name, attribution})

      if (!isAllowed || !logger?.cwv || rating === RATING.GOOD || !target) return

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

    const handleChange = ({name, value, entries}: {name: Metric; value: number; entries: PerformanceEntry[]}) => {
      const onReport = onReportRef.current
      const pathname = getPathname(route)
      const routeid = getRouteid()
      const type = getDeviceType()
      const isAllowed = allowed.includes(pathname!) || allowed.includes(routeid)

      if (!isAllowed) return

      if (onReport) {
        onReport({
          name,
          amount: value,
          pathname: pathname!,
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

      if (name === METRICS.INP) {
        entries.forEach(entry => {
          const metrics = computeINPMetrics(
            entry as PerformanceEntry & {processingStart: number; processingEnd: number}
          )

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
