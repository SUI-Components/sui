import {useContext, useEffect, useRef} from 'react'

import PropTypes from 'prop-types'
import * as reporter from 'web-vitals/attribution'

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

const DEFAULT_METRICS_REPORTING_ALL_CHANGES = [METRICS.LCP, METRICS.INP]

const DEFAULT_CWV_THRESHOLDS = {
  [METRICS.CLS]: 100,
  [METRICS.FCP]: 1800,
  [METRICS.FID]: 100,
  [METRICS.INP]: 200,
  [METRICS.LCP]: 2500,
  [METRICS.TTFB]: 800
}

export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile'
}

const getNormalizedPathname = pathname => {
  return pathname.replaceAll('*', '_').replace(/\\/g, '')
}

export default function WebVitalsReporter({
  children,
  deviceType,
  metrics = Object.values(METRICS),
  metricsAllChanges = DEFAULT_METRICS_REPORTING_ALL_CHANGES,
  onReport,
  pathnames,
  thresholds = DEFAULT_CWV_THRESHOLDS
}) {
  const {logger, browser} = useContext(SUIContext)
  const router = useRouter()
  const onReportRef = useRef(onReport)

  useEffect(() => {
    onReportRef.current = onReport
  }, [onReport])

  useMount(() => {
    const getPathname = () => {
      const {routes} = router
      const route = routes[routes.length - 1]
      return route?.path || route?.regexp?.toString()
    }

    const getRouteid = () => {
      const {routes} = router
      const route = routes[routes.length - 1]
      return route?.id
    }

    const getDeviceType = () => {
      return deviceType || browser?.deviceType
    }

    const getTarget = ({name, attribution}) => {
      switch (name) {
        case 'CLS':
          return attribution.largestShiftTarget
        case 'LCP':
          return attribution.element
        default:
          return attribution.eventTarget
      }
    }

    const handleAllChanges = ({attribution, name, value}) => {
      const amount = name === METRICS.CLS ? value * 1000 : value
      const pathname = getPathname()
      const isExcluded =
        !pathname || (Array.isArray(pathnames) && !pathnames.includes(pathname))

      if (isExcluded || !logger?.cwv || amount < thresholds[name]) return

      const target = getTarget({name, attribution})

      logger.cwv({
        name: `cwv.${name.toLowerCase()}`,
        amount,
        path: pathname,
        target,
        loadState: attribution.loadState
      })
    }

    const handleChange = ({name, value}) => {
      const onReport = onReportRef.current
      const pathname = getPathname()
      const routeid = getRouteid()
      const type = getDeviceType()
      const isExcluded =
        !pathname || (Array.isArray(pathnames) && !pathnames.includes(pathname))

      if (isExcluded) return

      if (onReport) {
        onReport({
          name,
          amount: value,
          pathname,
          routeid,
          type
        })
        return
      }

      if (!logger?.distribution) return

      const amount = name === METRICS.CLS ? value * 1000 : value

      logger.distribution({
        name: 'cwv',
        amount,
        tags: [
          {
            key: 'name',
            value: name.toLowerCase()
          },
          {
            key: 'pathname',
            value: getNormalizedPathname(pathname)
          },
          ...(routeid
            ? [
                {
                  key: 'routeid',
                  value: routeid
                }
              ]
            : []),
          ...(type
            ? [
                {
                  key: 'type',
                  value: type
                }
              ]
            : [])
        ]
      })
    }

    metrics.forEach(metric => {
      reporter[`on${metric}`](handleChange)
      if (DEFAULT_METRICS_REPORTING_ALL_CHANGES.includes(metric))
        reporter[`on${metric}`](handleAllChanges, {reportAllChanges: true})
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
   * An optional array of pathnames that you want to track
   */
  pathnames: PropTypes.arrayOf(PropTypes.string),
  /**
   * An object with METRICS as keys and thresholds as values
   * Thresholds by default are those above which Google considers the page as "needs improvement"
   * Lower thresholds could be set for fine-tuning, higher thresholds could be set for less noise when reporting all changes
   */
  thresholds: PropTypes.object
}
