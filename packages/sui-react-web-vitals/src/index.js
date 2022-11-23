import {useContext, useEffect, useRef} from 'react'

import {onCLS, onFID, onLCP, onTTFB} from 'web-vitals'

import SUIContext from '@s-ui/react-context'
import useMount from '@s-ui/react-hooks/lib/useMount/index.js'
import {useRouter} from '@s-ui/react-router'

export default function WebVitalsReporter({onReport, pathnames, children}) {
  const {logger} = useContext(SUIContext)
  const router = useRouter()
  const onReportRef = useRef(onReport)
  const pathnamesRef = useRef(pathnames)

  useEffect(() => {
    onReportRef.current = onReport
  }, [onReport])

  useEffect(() => {
    pathnamesRef.current = pathnames
  }, [pathnames])

  useMount(() => {
    const handleReport = ({name, value}) => {
      const {routes} = router
      const pathname = routes[routes.length - 1]?.path
      const pathnames = pathnamesRef.current

      if (
        !pathname ||
        (Array.isArray(pathnames) && !pathnames.includes(pathname))
      ) {
        return
      }

      if (onReportRef.current) {
        onReportRef.current({
          name,
          amount: value,
          pathname
        })
        return
      }

      if (!logger) {
        return
      }

      console.log(name, value, pathname)

      logger.timing({
        name,
        amount: value,
        tags: [
          {
            key: 'pathname',
            value: pathname
          }
        ]
      })
    }

    onTTFB(handleReport)
    onCLS(handleReport)
    onFID(handleReport)
    onLCP(handleReport)
  })

  return children
}
