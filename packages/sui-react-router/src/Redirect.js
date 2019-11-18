import invariant from 'invariant'

import {string, object} from 'prop-types'
import {falsy} from './InternalPropTypes'

const Redirect = () => {
  invariant(
    false,
    '<Redirect> elements are for router configuration only and should not be rendered'
  )
}

Redirect.displayName = 'Redirect'
Redirect.propTypes = {
  path: string,
  from: string, // Alias for path
  to: string.isRequired,
  query: object,
  state: object,
  onEnter: falsy,
  children: falsy
}

export default Redirect
