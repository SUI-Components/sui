import invariant from './internal/invariant'

interface RedirectProps {
  /** This component doesn't accept a children. If you provide one, you will get a warning  and it will be ignored */
  children?: never
  /**
   * The path you want to redirect from, including dynamic segments.
   */
  from?: string
  /**
   * By default, the query parameters will just pass through but you can specify them if you need to.
   */
  query?: object
  /**
    * The path you want to redirect to.
    */
  to: string

}
const Redirect = (props: RedirectProps): null =>
  invariant(
    false,
    '<Redirect> elements are for router configuration only and should not be rendered'
  )

Redirect.displayName = 'Redirect'

export default Redirect
