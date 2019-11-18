import createBrowserHistory from 'history/lib/createBrowserHistory'
import useQueries from 'history/lib/useQueries'
import useBasename from 'history/lib/useBasename'

export default useQueries(useBasename(createBrowserHistory))() // eslint-disable-line
