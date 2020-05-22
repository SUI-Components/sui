import PropTypes from 'prop-types'

import invariant from './internal/invariant'
import {falsy} from './internal/PropTypes'

const Redirect = () =>
  invariant(
    false,
    '<Redirect> elements are for router configuration only and should not be rendered'
  )

Redirect.displayName = 'Redirect'
Redirect.propTypes = {
  /** This component doesn't accept a children. If you provide one, you will get a warning  and it will be ignored */
  children: falsy,
  /**
   * The path you want to redirect from, including dynamic segments.
   */
  from: PropTypes.string, // Alias for path
  /**
   * By default, the query parameters will just pass through but you can specify them if you need to.
   */
  query: PropTypes.object,
  /**
   * The path you want to redirect to.
   */
  to: PropTypes.string.isRequired
}

export default Redirect
