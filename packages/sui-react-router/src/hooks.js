import {useContext} from 'react'
import Context from './internal/Context'

/**
 * @returns {{router: import('./types').Router}}
 */
const useRouterContext = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('@s-ui/react-router must be used within a <Router />')
  }
  return context
}

/**
 * @returns {import('./types').Params}
 */
export const useParams = () => useRouterContext().router.params

/**
 * @returns {import('./types').Location}
 */
export const useLocation = () => useRouterContext().router.location

/**
 * @returns {import('./types').Router}
 */
export const useRouter = () => useRouterContext().router
